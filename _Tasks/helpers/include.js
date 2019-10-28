module.exports = function(grunt, hasBase) {
	this._ = require('lodash');
	var fs = require('fs');
	var path = require('path');
	this.grunt = grunt;

	this.captureEnv = function(){
		return {
	        browsers: deployEnv.pdf && deployEnv.pdf.browsers || ['chrome'],
	        pages: deployEnv.pdf && deployEnv.pdf.pages || ['index.html'],
			sizes: deployEnv.pdf && deployEnv.pdf.sizes || [[1080, 608]]
		};
	};

	this.loadTargets = function(config){
		var os = require('os');

	    var targets = [
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

	    if(contentJson.attributes.staging && contentJson.attributes.staging.ssh){
	    	targets.push({file: contentJson.attributes.staging.ssh, json: true});
	    }

	    if(contentJson.attributes.qc && contentJson.attributes.qc.ssh){
	    	targets.push({file: contentJson.attributes.qc.ssh, json: true});
	    }

	    if(contentJson.attributes.production && contentJson.attributes.production.ssh){
	    	targets.push({file: contentJson.attributes.production.ssh, json: true});
	    }

	    contentJson.attributes.content && contentJson.attributes.content.forEach(function(d){
			if(d.ssh){
		    	targets.push({file: d.ssh, json: true});
		    }	    	
	    });

	    targets.forEach(function(d){
	    	if(config.targets[d.key || d.file]){
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

		    config.targets[d.key || d.file] = safeLoad(grunt, save, (d.json === false) ? false : true);
	    });

	    this.deployCred = (deployEnv.ssh) ? config.targets[deployEnv.ssh] : {};
	};

	this.truePath = function(path, env){
		var temp = path.replace(/\/+$/, "");
		var tempEnv = (env) ? (contentJson.attributes[env] || {}) : deployEnv;

        temp += '/';

        if(tempEnv.subDir){
            temp += tempEnv.subDir;
            temp += '/';
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
	}

    this.reload = function(){
    	var json = {};
    	var loaded = [];

    	grunt.log.writeln("Merging configs");

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

		grunt.file.write(contentPath, JSON.stringify(json, null, 4));
    }

	this.devProject = require('./dev.js');

	if(grunt && !hasBase){
		grunt.file.setBase('../' + (devProject || '../..') + '/');
	}

	this.config = null;

	this.configPath = (devProject) ? '../config-grunt/' : 'node_modules/@fishawack/config-grunt/';

	if(grunt){
		this.contentPath = '.tmp/content.json';

		reload();
		
		this.contentJson = grunt.file.readJSON(contentPath);

	    this.gitLogString = "";

	    var branch = require('yargs').argv.branch;

	    this.deployBranch = (!branch) ? require('git-branch').sync() : branch;

	    switch(this.deployBranch){
	    	case 'master':
	    		this.deployTarget = 'production';
	    		break;
			case 'qc':
	    		this.deployTarget = 'qc';
	    		break;
			default:
	    		this.deployTarget = 'staging';
	    }

	    this.deployEnv = contentJson.attributes[deployTarget] || {};

	    this.deployCred = {};

	    this.deployLocation = truePath((deployEnv.location || ''));

	    this.deployUrl = truePath((deployEnv.url || ''));
	}
}