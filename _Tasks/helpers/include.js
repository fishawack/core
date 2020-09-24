module.exports = function(grunt, hasBase) {
	this._ = require('lodash');
	var fs = require('fs');
	this.path = require('path');
	this.grunt = grunt;
	this.config = null;
	this.reset = null; // Used to reset config back to defaults after a task has overrideen them locally
	var mocha = require('yargs').argv.mocha || false; // True when core mocha tests running

	// Used in grunt JIT call to load plugins, can be overridden/added to in build folder include.js
	this.jit = {
        postcss: '@lodder/grunt-postcss'
    };

	// Sync init function
	this.initConfig = () => {
		config = {
			dev: grunt.cli.tasks.indexOf('dist') === -1,
			pkg: grunt.file.readJSON('package.json'),
			//CONTENT IN CONIFG SO IT CAN BE PASSED TO GRUNT TASKS
			contentJson: {},
			configPath: configPath,
			//ROOT OF SITE WHERE FILES
			root: contentJson.attributes.root || '_Output',
			targets: {},
			//SET IN PHONEGAP TASK
			pullApp: '',
			//REPO INFORMATION
			repo: {},
			//FILENAME USED WHEN SAVING OUT ASSETS e.g PDF OF BUILD
			filename: ''
		};
		
		config.targets = loadTargets();
		config.repo = repoInfo();
		config.filename = filename();

		this.reload();

		config.contentJson = this.contentJson;

		this.deployEnv = contentJson.attributes.deploy && contentJson.attributes.deploy[deployBranch] || {};
	    this.deployLocation = truePath(deployEnv.location || '');
		this.deployUrl = truePath(deployEnv.url || '');
		this.deployCred = config.targets[deployEnv.ssh || deployEnv.lftp] || {};

		console.log(this.deployLocation, deployEnv.location);
	};

	// This function is called twice on startup, the first time is used to grab deploy targets and hard coded values, the second time and all subsequent watch reloads will process any grunt template tags that are found
	this.reload = function(){
    	var json = {};
    	var loaded = [];

    	grunt.log.writeln(`Merging ${config ? 'processed' : 'raw'} configs`);

        grunt.file.expand([
					'_Build/config/*.json',
					'_Build/config/example/*.json',
					'_Build/*.json',
					'_Build/example/*.json'
					
				]).forEach(function(d){
					// Only load config types once, lower configs override higher ones
					if(loaded.indexOf(path.basename(d)) === -1){
						grunt.log.ok(d, "loaded");

						loaded.push(path.basename(d));

						_.mergeWith(json, grunt.file.readJSON(d), function(obj, src) {
								if (_.isArray(obj)) {
									return obj.concat(src);
								}
							});
					} else {
						grunt.log.error(d, "ignored");
					}
			});

		let raw = JSON.stringify(json, null, 4);

		if(config){
			config.contentJson = json;

			raw = grunt.template.process(raw, {data: config});
		}

		grunt.file.write(contentPath, raw);

		this.contentJson = JSON.parse(raw);
    }

	this.filename = () => `${config.repo.name}_${config.pkg.version}_${grunt.template.today("UTC:yyyy-mm-dd")}_${config.repo.commit}`;

	this.repoInfo = () => {
		const execSync = require('child_process').execSync;

		var commit;
		var name;

		try{
			name = execSync('git rev-parse --show-toplevel', {encoding: 'utf8'});
			commit = execSync('git rev-parse --short HEAD', {encoding: 'utf8'});
		} catch(e){
			name = process.cwd();
			commit = require('password-generator')(7, false, /\d/);
		}
		
		var repo = {
            name: path.basename(name).trim(),
            group: '',
			path: '',
			commit: commit.trim()
		};
	
		if(config.targets.misc && config.targets.misc.bitbucket){
			var url = `https://api.bitbucket.org/2.0/repositories/fishawackdigital/${repo.name}`;
			var username = config.targets.misc.bitbucket.username;
			var password = config.targets.misc.bitbucket.password;
			
			if(username && password){
				try{
					var info = JSON.parse(execSync(`curl --connect-timeout 5 -s -u "${username}":"${password}" ${url}`, {encoding: 'utf8', stdio: 'pipe'}));
				} catch (e){
					return repo;
				}
				
				if(info && !info.error){
					repo.group = info.project.name.toLowerCase();
					repo.path = `${repo.group}/${repo.name}`;
				} else {
					grunt.log.warn("Failed to retrieve repo information, are the credentials store in ~/targets/misc.json correct?");
				}
			} else {
				grunt.log.warn("Can't find bitbucket credentials in ~/targets/misc.json");
			}
		} else {
			grunt.log.warn("~/targets/misc.json not found");
		}

		return repo;
	};

	this.captureEnv = function(){
		return {
	        browsers: deployEnv.pdf && deployEnv.pdf.browsers || ['chrome'],
	        pages: deployEnv.pdf && deployEnv.pdf.pages || ['index.html'],
			sizes: deployEnv.pdf && deployEnv.pdf.sizes || [[1080, 608]],
			url: deployEnv.pdf && deployEnv.pdf.url || 'http://localhost:9001',
			wait: deployEnv.pdf && deployEnv.pdf.wait || '.loaded'
		};
	};

	this.loadTargets = function(){
		var targets = {};
		
		var os = require('os');

	    var files = [
	    	{
	    		file: 'id_rsa',
	    		path: '/.ssh/',
	    		key: 'key',
	    		json: false
	    	},
	    	{
	    		file: '.ftppass',
	    		key: 'ftp'
	    	},
	    	{
	    		file: 'misc.json',
	    		key: 'misc'
	    	}
		];
		
		for(var key in contentJson.attributes.deploy){
			if(contentJson.attributes.deploy.hasOwnProperty(key)){
				if(contentJson.attributes.deploy[key] && contentJson.attributes.deploy[key].ssh){
					files.push({file: contentJson.attributes.deploy[key].ssh, json: true});
				}

				if(contentJson.attributes.deploy[key] && contentJson.attributes.deploy[key].lftp){
					files.push({file: contentJson.attributes.deploy[key].lftp, json: true});
				}
			}
		}

	    contentJson.attributes.content && contentJson.attributes.content.forEach(function(d){
			if(d.ssh){
		    	files.push({file: d.ssh, json: true});
		    }	    	
	    });

	    files.forEach(function(d){
	    	if(targets[d.key || d.file]){
	    		return;
	    	}

	    	var path = os.homedir() + (d.path || '/targets/');
	    	var file =  d.file + ((d.json) ? '.json' : '');
	    	var save = ((d.key) ? '' : 'ssh-') + file;

			if(!fileExists(save, './', grunt)){
				grunt.log.warn(save + ' not found in root, attempting to copy ' + file + ' from ' + path);

				try{
					fs.copyFileSync(path + file, save);
					grunt.log.ok(file + ' copied');
				} catch(e){
					grunt.log.warn(file + ' not found at ' + path);
				}
		    }

		    targets[d.key || d.file] = safeLoad(grunt, save, (d.json === false) ? false : true);
	    });
		
		return targets;
	};

	this.truePath = function(path, env){
		var temp = stripTrailingSlash(path);
		var tempEnv = (env) ? (contentJson.attributes[env] || {}) : deployEnv;

        if(tempEnv.subDir){
            temp += '/' + tempEnv.subDir;
        }

        return temp;
	};

	this.templateCustom = function(){
		var handlebars = grunt.config.data['compile-handlebars'].default.files;

		for(var key in contentJson.attributes.template){
			var dynamic = contentJson.attributes.template[key];
			var obj = {
				src: '_Build/' + dynamic.partial + '.html',
				dest: []
			};

			if(dynamic.jsonPath){
				var tempJson = (dynamic.location) ? grunt.file.readJSON(dynamic.location) : contentJson;

				var tempObj = getProperty(dynamic.jsonPath, tempJson);

				for(var i = 0; i < tempObj.length; i++){
					var name = tempObj[i].url || key + i;

					obj.dest.push('.tmp/compiled/' + name + '.html');
				}
			} else {
				obj.dest.push('.tmp/compiled/' + key + '.html');
			}

			handlebars.push(obj);
		}
	};

	this.safeLoad = function(grunt, file, json, cwd){
	    if(json){
	        return (fileExists(file, cwd || './', grunt) ? grunt.file.readJSON((cwd || '') + file) : {})
	    }

	    return (fileExists(file, cwd || './', grunt) ? grunt.file.read((cwd || '') + file) : {})
	}

	this.slugify = function(text) {
	  return text.toString().toLowerCase()
	    .replace(/\s+/g, '-')           // Replace spaces with -
	    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
	    .replace(/^-+/, '')             // Trim - from start of text
	    .replace(/-+$/, '');            // Trim - from end of text
	}

	this.generateUserPasswords = function(){
        var generatePassword = require('password-generator');

        deployEnv.users.forEach(function(d, i){
            if(!d.password){
                d.password = generatePassword(8, false);
            }
        });

        grunt.file.write(contentPath, JSON.stringify(contentJson, null, 4));
    }
	
	this.watchSmokeTests = function (){
		// Create test watches so that updating a test file only runs tests for that file. All tests run on grunt dist and grunt deploy
	    var watch = grunt.config.get('watch') || {};
	    var casperjs = grunt.config.get('casperjs') || {};
	    var casperPath = '_Test/casperjs/';

	    grunt.file.expand({cwd: casperPath}, '*.js').forEach(function(d){
	        watch['smokeTests-' + d] = {
	            files: [casperPath + d],
	            tasks: ['casperjs:' + d],
	            options: {
	                spawn: false,
	            }
	        };

	        casperjs[d] = {
	            src: [casperPath + d]
	        };
	    });

	    grunt.config.set('watch', watch);
	    grunt.config.set('casperjs', casperjs);
	}

	this.getIP = function () {
	    var os = require('os');
	    var ifaces = os.networkInterfaces();
	    var storeIP = '';

	    Object.keys(ifaces).forEach(function (ifname) {
	      var alias = 0
	        ;

	      ifaces[ifname].forEach(function (iface) {
	        if ('IPv4' !== iface.family || iface.internal !== false) {
	          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	          return;
	        }

	        if (alias >= 1) {
	          // this single interface has multiple ipv4 addresses
	          //console.log(ifname + ':' + alias, iface.address);
	          storeIP = iface.address;
	        } else {
	          // this interface has only one ipv4 adress
	          //console.log(ifname, iface.address);
	          storeIP = iface.address;
	        }
	      });
	    });

	    return storeIP;
	}

	this.getSassVariable = function (variable, sass) {
	    var vars = sass.split('\n');
	    for (var i = 0; i < vars.length; i++) {
	        var pair = vars[i].split('//')[0].split(';')[0].split(':');
	        if (pair[0].trim() === variable) {
	            return pair[1].trim();
	        }
	    }
	    console.log('Sass variable %s not found', variable);
	}

	this.fileExists = function (name, fileLocation, grunt) {
        var found = false;
        if(name !== null || fileLocation !== null || grunt !== null)
        {
            grunt.file.expand({cwd: fileLocation, dot: true}, '*').forEach(function(element, index){
                if(element.toLowerCase().localeCompare(name.toLowerCase()) == 0)
                    found = true;
            });
        }

        return found;
    }

	this.getFilesize = function (filename) {
        var fs = require("fs");
        var stats;

        try{
        	stats = fs.statSync(filename);	
        } catch(e){
        	grunt.log.warn(filename + ' file not found');
        	return formatBytes(0, 1);
        }
        
        var stats = fs.statSync(filename);
        
        return stats["size"];;
    }

	this.getFilesizeInBytes = function (filename) {
        return formatBytes(getFilesize(filename), 1);
    }

    this.formatBytes = function(bytes, decimals) {
        if(bytes == 0) return '0 Byte';
        var k = 1000; // or 1024 for binary
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    this.patch = function(version, type) {
        var split = version.split('.');
        if(type === 'build'){
            return split[0] + '.' + split[1] + '.' + (+split[2] + 1);
        } else if(type === 'minor') {
            return split[0] + '.' + (+split[1] + 1) + '.' + split[2];
        } else {
            return (+split[0] + 1) + '.' + split[1] + '.' + split[2];
        }
    }

    this.getProperty = function(jsonPath, object) {
		var parts = jsonPath.split("."),
			length = parts.length,
			i,
			property = object || this;

		for(i = 0; i < length; i++){
			if(!property){
				return null;
			}
			
			property = property[parts[i]];
		}

		return property;
	}

    this.objectInArray = function(array, value, key){
        for(var i = 0, len = array.length; i < len; i++){
            if(array[i][key] === value){
                return true;
            }
        }
        return false;
    }

    this.buildHtmlEmail = function(type){
        return grunt.config.process(grunt.file.read(this.configPath + '_Tasks/helpers/htmlEmail/' + type + '.html'));
    }

	if (!String.format) {
	  String.format = function(format) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    return String(format.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number] 
	        : match
	      ;
	    }));
	  };
	}

    if (!String.formatKeys) {
      String.formatKeys = function(format) {
        var args = arguments[1];
        return String(format.replace(/{(\w+)}/g, function(match, key) { 
          return typeof args[key] != 'undefined'
            ? args[key] 
            : match
          ;
        }));
      };
    }

    if (!String.formatKeysCustom) {
      String.formatKeysCustom = function(format, regex) {
        var args = arguments[2];
        return String(format.replace(regex, function(match, key) { 
          return typeof args[key] != 'undefined'
            ? args[key] 
            : match
          ;
        }));
      };
    }

	Array.prototype.alphanumSort = function(caseInsensitive) {
	  for (var z = 0, t; t = this[z]; z++) {
	    this[z] = new Array();
	    var x = 0, y = -1, n = 0, i, j;

	    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
	      var m = (i == 46 || (i >=48 && i <= 57));
	      if (m !== n) {
	        this[z][++y] = "";
	        n = m;
	      }
	      this[z][y] += j;
	    }
	  }

	  this.sort(function(a, b) {
	    for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
	      if (caseInsensitive) {
	        aa = aa.toLowerCase();
	        bb = bb.toLowerCase();
	      }
	      if (aa !== bb) {
	        var c = Number(aa), d = Number(bb);
	        if (c == aa && d == bb) {
	          return c - d;
	        } else return (aa > bb) ? 1 : -1;
	      }
	    }
	    return a.length - b.length;
	  });

	  for (var z = 0; z < this.length; z++)
		this[z] = this[z].join("");
		
	  return this;
	}

	this.stripTrailingSlash = (str) => {
		return str.endsWith('/') ?
			str.slice(0, -1) :
			str;
	};

	this.devProject = require('./dev.js');

	if(grunt && !hasBase){
		if(mocha){
			grunt.file.setBase(`_Test/_fixture/${mocha}/`);
		} else {
			grunt.file.setBase('../' + (devProject || '../..') + '/');
		}
	}

	if(mocha){
		this.configPath = '../../../';	
	} else{
		this.configPath = (devProject) ? '../core/' : 'node_modules/@fishawack/core/';
	}

	if(grunt){
		this.contentPath = '.tmp/content.json';

		this.reload();

		this.contentJson = grunt.file.readJSON(contentPath);

		this.gitLogString = "";

		// Used in veeva task to define what exactly is a keymessage and what should be zipped as such
		this.keyMessages = null;

		var branch = require('yargs').argv.branch;

		// If no git initialized in the build repo this will fail fatally
		this.deployBranch;
		try{
			this.deployBranch = (!branch) ? require('git-branch').sync() : branch;
		} catch(e){
			this.deployBranch = 'unknown';
		}
		
		this.deployCred = {};

		this.deployEnv = '';

		this.deployLocation = '';

		this.deployUrl = '';
	}
}