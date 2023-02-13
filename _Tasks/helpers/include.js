module.exports = function(grunt, hasBase, fixture) {
	this._ = require('lodash');
	var fs = require('fs');
	this.path = require('path');
	this.grunt = grunt;
	this.config = null;
	this.reset = null; // Used to reset config back to defaults after a task has overrideen them locally
	var mocha = fixture || grunt.option('mocha') || false; // True when core mocha tests running

	// Used in grunt JIT call to load plugins, can be overridden/added to in build folder include.js
	this.jit = {
        postcss: '@lodder/grunt-postcss'
	};

	this.devProject = require('./dev.js') || mocha;

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
	
	try{
		this.deployBranch = grunt.option('branch') || process.env.BRANCH || process.env.CI_COMMIT_REF_NAME || require('git-branch').sync();
	} catch(e){
		this.deployBranch = 'unknown';
	}
	
	this.deployCred = {};

	this.deployEnv = '';

	this.deployLocation = '';

	this.deployUrl = '';

	// Sync init function
	this.initConfig = () => {
		config = {
			dev: (grunt.cli.tasks.indexOf('dist') === -1) && (!grunt.option('dist')),
			pkg: grunt.file.readJSON('package.json'),
			//CONTENT IN CONIFG SO IT CAN BE PASSED TO GRUNT TASKS
			contentJson: {},
			configPath: configPath,
			//ROOT OF SITE WHERE FILES - e.g _Output/ or _Output/subdirectory/
			root: contentJson.attributes.root || '_Output',
			//THE WEB ROOT - e.g _Output/
			webRoot: (contentJson.attributes.root || '_Output').split(path.sep)[0],
			//SRC FILES
			src: contentJson.attributes.src || '_Build',
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

		this.deployEnv = contentJson.attributes.deploy || {};
	    this.deployLocation = truePath(deployEnv.location || '');
		this.deployUrl = truePath(deployEnv.url || '');
		this.deployCred = config.targets[deployEnv.ssh || deployEnv.lftp || deployEnv.ftp] || {};

		this.deployValid = () => {
			if(!deployLocation){
				grunt.log.warn('No deployment location configured for ' + deployBranch);
			} else if(deployEnv['aws-s3']){
				const execSync = require('child_process').execSync;
				let profile = deployEnv['aws-s3'];
				
				if(!execSync(`aws configure list-profiles`, {encoding: 'utf8'}).split('\n').includes(profile)){
					grunt.fatal(new Error('No aws credentials found for ' + profile));
				}

				return true; // aws creds are configured elsewhere from the core
			} else if(deployEnv['aws-eb']){
				const execSync = require('child_process').execSync;
				let profile = deployEnv['aws-eb'];
				
				if(!execSync(`eb list`, {encoding: 'utf8'}).split('\n').find(d => d.includes(profile))){
					grunt.fatal(new Error('No eb configuration found for ' + profile));
				}

				return true; // aws creds are configured elsewhere from the core
			} else if(!deployCred.username || !deployCred.host){
				grunt.fatal(new Error('No deployment credentials found for ' + deployBranch));
			} else if(deployEnv.ftp && deployEnv.loginType){
				grunt.fatal('Cannot deploy watertight over ftp for ' + deployBranch);   
			} else {
				return true;
			}
		};

		keyMessages = [
			{
				zipName: `${config.repo.name}`,
				seqName: contentJson.attributes.title,
				screenshotName: '*',
				root: config.root,
				veeva: {}
			}
		];
	};

	// This function is called twice on startup, the first time is used to grab deploy targets and hard coded values, the second time and all subsequent watch reloads will process any grunt template tags that are found
	this.reload = function(){
    	var json = {};
    	var loaded = [];

    	grunt.log.writeln(`Merging ${config ? 'processed' : 'raw'} configs`);

        grunt.file.expand([
				'./fw.json',
				'!./fw*example.json',
				'./fw*example.json',
				'./content.json',
				'!./content*example.json',
				'./content*example.json',
				'./level-*.json',
				'!./level-*example.json',
				'./level-*example.json',
				'_Build/config/*.json',
				'!_Build/config/*example.json',
				'_Build/config/*example.json',
				'_Build/config/example/*.json',
				'_Build/*.json',
				'!_Build/*example.json',
				'_Build/*example.json',
				'_Build/example/*.json'
			]).forEach(function(d){
				// Only load config types once, lower configs override higher ones
				if(loaded.indexOf(path.basename(d.replace('.example', ''))) === -1){
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
		
		grunt.log.writeln(`Merging ${config ? 'processed' : 'raw'} targets`);

		_.mergeWith(json.attributes, json.attributes.targets && json.attributes.targets[this.deployBranch] || {}, function(obj, src) {
				if (_.isArray(obj)) {
					return obj.concat(src);
				}
			});

		let raw = JSON.stringify(json, null, 4);

		if(config){
			config.contentJson = json;

			raw = grunt.template.process(raw, {data: config});
		}

		grunt.file.write(contentPath, raw);

		this.contentJson = JSON.parse(raw);

		// Set Env variables
		if(config){
			process.env = Object.assign(process.env,
				{ 
					NODE_TARGET: deployBranch,
					NODE_ENV: config.dev ? "development" : "production"
				},
				this.contentJson.attributes.env
			);
		}
    }

	this.filename = () => `${config.repo.name}_${config.pkg.version || 'unversioned'}_${grunt.template.today("UTC:yyyy-mm-dd")}_${deployBranch}_${config.repo.commit}`;

	this.repoInfo = () => {
		const execSync = require('child_process').execSync;

		var commit;
		var name;

		try{
			name = process.env.REPO || execSync('basename -s .git `git config --get remote.origin.url`', {encoding: 'utf8'}) || 'unknown';
			commit = execSync('git rev-parse --short HEAD', {encoding: 'utf8'});
		} catch(e){
			name = process.cwd();
			commit = `${Math.floor(Math.random()*90000) + 1000000}`;
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
	        browsers: contentJson.attributes.capture && contentJson.attributes.capture.browsers || ['chrome'],
	        pages: contentJson.attributes.capture && contentJson.attributes.capture.pages || require('glob').sync(`**/*.html`, {cwd: contentJson.attributes.root || '_Output'}).map(d => `/${d}`),
			sizes: contentJson.attributes.capture && contentJson.attributes.capture.sizes || [[1080, 608]],
			url: contentJson.attributes.capture && contentJson.attributes.capture.url || 'http://localhost:9001',
			wait: contentJson.attributes.capture && contentJson.attributes.capture.wait || '.loaded'
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
	    		file: 'misc',
	    		key: 'misc',
				json: true
	    	},
	    	{
	    		file: 'ftp-fishawack.egnyte.com',
	    		key: 'egnyte',
				json: true
	    	}
		];
		
		for(var key in contentJson.attributes.targets){
			if(contentJson.attributes.targets.hasOwnProperty(key)){
				if(contentJson.attributes.targets[key].deploy && contentJson.attributes.targets[key].deploy.ssh){
					files.push({file: contentJson.attributes.targets[key].deploy.ssh, json: true});
				}

				if(contentJson.attributes.targets[key].deploy && contentJson.attributes.targets[key].deploy.lftp){
					files.push({file: contentJson.attributes.targets[key].deploy.lftp, json: true});
				}
			}
		}

	    contentJson.attributes.content && contentJson.attributes.content.forEach(function(d){
			files.push({file: d.lftp || d.ssh || d.ftps || d.ftp, json: true});
	    });

	    files.forEach(function(d){
	    	if(targets[d.key || d.file]){
	    		return;
	    	}

	    	var path = os.homedir() + (d.path || '/targets/');
	    	var file =  d.file + ((d.json) ? '.json' : '');

			try{
				targets[d.key || d.file] = grunt.file[d.json ? 'readJSON' : 'read'](`${path}/${file}`);
			} catch(e){
				grunt.log.warn(file + ' not found at ' + path);
			}
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
				src: `${config.src}/${dynamic.partial}.html`,
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

	this.alphanumSort = module.exports.alphanumSort;

	this.stripTrailingSlash = (str) => {
		return str.endsWith('/') ?
			str.slice(0, -1) :
			str;
	};

	this.url_join = require('./misc.js').url_join;

	if(grunt){
		this.contentPath = '.tmp/content.json';

		this.reload();

		this.contentJson = grunt.file.readJSON(contentPath);

		this.gitLogString = "";

		// Used in veeva task to define what exactly is a keymessage and what should be zipped as such
		this.keyMessages = null;
	}
}

module.exports.alphanumSort = function(arr, caseInsensitive) {
	for (var z = 0, t; t = arr[z]; z++) {
		arr[z] = new Array();
		var x = 0, y = -1, n = 0, i, j;

		while (i = (j = t.charAt(x++)).charCodeAt(0)) {
		var m = (i == 46 || (i >=48 && i <= 57));
		if (m !== n) {
			arr[z][++y] = "";
			n = m;
		}
		arr[z][y] += j;
		}
	}

	arr.sort(function(a, b) {
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

	for (var z = 0; z < arr.length; z++)
		arr[z] = arr[z].join("");
		
	return arr;
}

module.exports.log = {
	message(color){
		console.log(`\x1b[${color}m%s\x1b[0m`, `>>`, ...[...arguments].slice(1));
	},
	ok(){
		this.message(32, ...arguments);
	},
	warn(){
		this.message(33, ...arguments);
	},
	error(){
		this.message(31, ...arguments);
	}
}