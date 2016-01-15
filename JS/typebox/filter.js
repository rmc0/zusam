var Filter = {
	
	//searchDeezer : function(inner, ending) {
	//	var r1 = /[\s]*(https?:\/\/www.deezer.com\/)(playlist)\/(\d+)$/gi;
	//	if(!ending) {
	//		r1 = new RegExp(r1+'[\s]','gi');
	//	}
	//	substitution = function(str) {
	//		playlist_id = str.replace(/[\s]*(https?:\/\/www.deezer.com\/)(playlist)\/(\d+)$/,'$3');
	//		o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
	//		//output += '<div class="embed-responsive embed-responsive-16by9"><iframe scrolling="no" frameborder="0" allowTransparency="true" src="http://www.deezer.com/plugins/player?playlist=true&type=playlist&id='+playlist_id+'"></iframe></div>';
	//		var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
	//		o += '<div class="embed-responsive embed-responsive-16by9"><div onclick="loadIframe(this)" data-src="http://www.deezer.com/plugins/player?playlist=true&autoplay=true&type=playlist&id='+playlist_id+'" class="iframeLauncher" style="background-image:url('+xx+')"></div></div>';
	//		o += '</span>';

	//		return o;
	//	}
	//	output = Control.searchMatch({"callerName":"searchDeezer", "inner":inner, "regex":r1, "substitution":substitution});
	//	return output;
	//	
	//},

	searchSoundcloud : function(inner, ending) {
		var r1 = /[\s]*(https?:\/\/soundcloud.com\/)([^\s]+)/gi;
		//var r1 = /[\s]*(https?:\/\/soundcloud.com\/)([\w\-]+)\/([\w\-]+)(\/[\w\-]+)?(\?[^\s]+)?/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
			output = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'"><img src="'+'Assets/ajax-loader.gif"/></span>';
			setTimeout( function() {
				SC.oEmbed(str, { auto_play: true }, function(oEmbed) {
					song_url = oEmbed.html.replace(/.*src="([^"]+)".*/,'$1');
					var w = song_url.replace(/auto_play=false/,"auto_play=true");
					//output = '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" scrolling="no" frameborder="0" src="'+song_url+'"></iframe></div>';
					var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
					//var o = '<div class="embed-responsive embed-responsive-16by9"><div onclick="loadIframe(this)" data-src="'+song_url+'" class="iframeLauncher" style="background-image:url('+xx+')"></div></div>';
					var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
					o += '<div class="embed-responsive embed-responsive-16by9">';
					o += '<div onclick="loadIframe(this)" data-src="'+w+'" class="launcher">';
					o += '<img src="'+xx+'" onerror="loadIframe(this)"/>';
					o += '</div></div></span>';
					$('#'+str2md5(str)).html(o);
				});
			}, 50);
			return output;
		}
		output = Control.searchMatch({"callerName":"searchSoundcloud", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
		
	},

	searchVine : function(inner, ending) {
		var r1 = /[\s]*(https?:\/\/vine.co\/v\/)([\w\-]+)/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
			var b = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
			var o = str.replace(/(https?:\/\/vine.co\/v\/)([\w\-]+)/,'<div class="embed-responsive embed-responsive-square"><iframe seamless class="embed-responsive-item" src="$1$2/embed/simple" frameborder="0"></iframe></div><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script>');
			var a = '</span>';
			return b+o+a;
		}
		output = Control.searchMatch({"callerName":"searchVine", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
		
	},

	searchDailymotion : function(inner, ending) {
		var r1 = /[\s]*(https?:\/\/www.dailymotion.com\/video\/)([\w\-]+)/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
			var w = str.replace(/(https?:\/\/www.dailymotion.com\/video\/)([\w\-]+)/,'http://www.dailymotion.com/embed/video/$2?autoplay=1');
			var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
			//var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'"><div class="embed-responsive embed-responsive-16by9"><div onclick="loadIframe(this)" data-src="'+w+'" class="iframeLauncher" style="background-image:url('+xx+')"></div></div></span>';
			var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
			o += '<div class="embed-responsive embed-responsive-16by9">';
			o += '<div onclick="loadIframe(this)" data-src="'+w+'" class="launcher">';
			o += '<img src="'+xx+'" onerror="loadIframe(this)"/>';
			o += '</div></div></span>';
			return o;
		}
		output = Control.searchMatch({"callerName":"searchDailymotion", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
		
	},

	searchVimeo : function(inner, ending) {
		var r1 = /[\s]*(https?:\/\/vimeo.com\/)(channels\/staffpicks\/)?([0-9]+)/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
			var w = str.replace(/(https?:\/\/vimeo.com\/)(channels\/staffpicks\/)?([0-9]+)/,'http://player.vimeo.com/video/$3?autoplay=1');
			var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
			//var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'"><div class="embed-responsive embed-responsive-16by9"><div onclick="loadIframe(this)" data-src="'+w+'" class="iframeLauncher" style="background-image:url('+xx+')"></div></div></span>';
			var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
			o += '<div class="embed-responsive embed-responsive-16by9">';
			o += '<div onclick="loadIframe(this)" data-src="'+w+'" class="launcher">';
			o += '<img src="'+xx+'" onerror="loadIframe(this)"/>';
			o += '</div></div></span>';
			return o;
		}
		output = Control.searchMatch({"callerName":"searchVimeo", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
		
	},

	searchYoutube2 : function(inner, ending) {
		var r1 = /[\s]*https?:\/\/youtu\.be\/[\w\/=?~.%&+\-#]+/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
			var v = str.replace(/(https?:\/\/youtu\.be\/)([\w\-]+)([^\s]*)/,"$2");
			var w = 'http://www.youtube.com/embed/'+v+'?autoplay=1&controls=2&wmode=opaque';
			//var x = 'http://i.ytimg.com/vi/'+v+'/hqdefault.jpg';
			var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
			//var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'"><div class="embed-responsive embed-responsive-16by9"><div onclick="loadIframe(this)" data-src="'+w+'" class="iframeLauncher" style="background-image:url('+xx+')"></div></div></span>';
			var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
			o += '<div class="embed-responsive embed-responsive-16by9">';
			o += '<div onclick="loadIframe(this)" data-src="'+w+'" class="launcher">';
			o += '<img src="'+xx+'" onerror="loadIframe(this)"/>';
			o += '</div></div></span>';
			return o;
		}
		output = Control.searchMatch({"callerName":"searchYoutube2", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
		
	},

	searchYoutube : function(inner, ending) {
		var r1 = /[\s]*https?:\/\/(www|m)\.youtube\.com\/watch[\w\/=?~.%&+\-#]+/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
			var v = str.replace(/(https?:\/\/(www|m).youtube.com\/watch\?)([^\s]*)v=([\w\-]+)([^\s]*)/,"$4");
			var w = 'http://www.youtube.com/embed/'+v+'?autoplay=1&controls=2&wmode=opaque';
			//var x = 'http://i.ytimg.com/vi/'+v+'/hqdefault.jpg';
			var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
			//var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'"><div class="embed-responsive embed-responsive-16by9"><div onclick="loadIframe(this)" data-src="'+w+'" class="iframeLauncher" onerror="function(){console.log(this)}" style="background-image:url('+xx+')"></div></div></span>';
			var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
			o += '<div class="embed-responsive embed-responsive-16by9">';
			o += '<div onclick="loadIframe(this)" data-src="'+w+'" class="launcher">';
			o += '<img src="'+xx+'" onerror="loadIframe(this)"/>';
			o += '</div></div></span>';
			return o;
		}
		output = Control.searchMatch({"callerName":"searchYoutube", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
		
	},

	searchVideo : function(inner, ending) {
		var r1 = /[\s]*https?:\/\/[^\s]+(\.mp4|\.webm)(\?\w*)?/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
				var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
				var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
				o += '<div onclick="loadVideo(this)" data-src="'+str+'" class="launcher">';
				o += '<img src="'+xx+'" onerror="loadVideo(this)"/>';
				o += '</div></span>';
				return o;
		}
		output = Control.searchMatch({"callerName":"searchVideo", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
	},

	searchImage : function(inner, ending) {
		var r1 = /[\s]*https?:\/\/[\w\/=?~.%&+\-#\!\']+(\.png|\.bmp|\.jpg|\.jpeg)(\?[\w\/=?~.%&+\-#\!\']+)?/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
				return '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'"><img class="zoomPossible" onclick="lightbox.enlighten(this)" onerror="error_im(this)" src="'+str+'"/></span>';
		}
		output = Control.searchMatch({"callerName":"searchImage", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
	},

	searchGif : function(inner, ending) {
		var r1 = /[\s]*https?:\/\/[\w\/=?~.%&+\-#\!\']+(\.gif)(\?[\w\/=?~.%&+\-#\!\']+)?/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
				var xx = origin_url+'Data/miniature/'+str2md5(str)+'.jpg';
				var o = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str)+'">';
				o += '<div onclick="loadImage(this)" data-src="'+str+'" class="launcher">';
				o += '<img src="'+xx+'" onerror="loadImage(this)"/>';
				o += '</div></span>';
				return o;
		}
		output = Control.searchMatch({"callerName":"searchImage", "inner":inner, "regex":r1, "substitution":substitution});
		return output;
	},
	
	//searchAlbum : function(inner, ending, viewer) {
	//	r1 = /\{\:\:[a-zA-Z0-9]+\:\:\}/gi;
	//	substitution = function(str) {
	//		output = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str.replace(/#.+$/,''))+'"><img src="Assets/ajax-loader.gif"/></span>';
	//		return output;
	//	};
	//	var ajax_url = "Ajax/post.php";
	//	var ajax_var = {"action":"getAlbum", "viewer":viewer};
	//	callback = function(data) {
	//		//console.log(data);
	//		//console.log(data['html']);
	//		balise = $('#'+str2md5(decodeURI(data['url'])));
	//		balise.html(data['html']);
	//		slideshow.init();
	//	};
	//	fail = function(url) {
	//		balise = $('#'+str2md5(url));
	//		balise.html("error");
	//	}
	//	output = Control.searchMatch({"callerName":"searchAlbum", "inner":inner, "regex":r1, "substitution":substitution, "ajax_url":ajax_url, "ajax_var":ajax_var, "callback":callback, "fail":fail});
	//	return output;
	//},

	searchFile : function(inner, ending, viewer) {
		r1 = /\{\:[a-zA-Z0-9]+\:\}/gi;
		substitution = function(str) {
			output = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str.replace(/#.+$/,''))+'"><img src="Assets/ajax-loader.gif"/></span>';
			return output;
		};
		var ajax_url = "Ajax/post.php";
		var ajax_var = {"action":"getFile", "viewer":viewer};
		callback = function(data) {
			console.log(data);
			console.log(data['html']);
			balise = $('#'+str2md5(decodeURI(data['url'])));
			balise.html(data['html']);
		};
		fail = function(url) {
				balise = $('#'+str2md5(url));
				balise.html("error");

		}
		output = Control.searchMatch({"callerName":"searchFile", "inner":inner, "regex":r1, "substitution":substitution, "ajax_url":ajax_url, "ajax_var":ajax_var, "callback":callback, "fail":fail});
		return output;
	},

	fail_request : function(url) {
		//base_url = decodeURI(url).replace(/https?:\/\/(www\.)?([^\/\?\#]+).*/i,"$1$2");
		e = $('<a class="b-link" href="'+url.replace(/\s/," ")+'" target="_blank">'+url+'</a>');
		return e;
	},

	open_graph_build : function(data) {
		//base_url = decodeURI(data['url']).replace(/https?:\/\/(www\.)?([^\/\?\#]+).*/i,"$1$2");
		base_url = data['base_url'];
		var preview = ""; 
		if(typeof(data['image']) != "undefined") {
			if(typeof(data['image']['url']) != "undefined" && !data['image']['url'].match(/^\s*$/)) {
				var xx = origin_url+'Data/miniature/'+str2md5(data['url'])+'.jpg';
				//preview = '<div class="preview"><img src="'+data['image']['url']+'" onerror="error_im(this)"/></div>';
				preview = '<div class="preview"><img src="'+xx+'" onerror="error_im(this)"/></div>';
			}
		}
		if(typeof(data['title']) != "undefined" && data['title'] != "") {
			title = '<div class="title">'+html_entity_decode(data['title'])+'</div>'
		} else { title = ""; }
		if(typeof(data['description']) != "undefined" && data['description'] != "") {
			description = '<div class="description">'+html_entity_decode(data['description'])+'</div>';
		} else { description = ""; }
		if(preview != "" || (title != "" && description != "")) {
			e = $('<a class="article_big" href="'+decodeURI(data['url'])+'" target="_blank">'+preview+title+description+'<div class="base_url">'+base_url+'</div></a>');
			if(typeof(data['image']) != "undefined") {
				if(data['image']['url'] != "" && data['image']['width'] != null && data['image']['height'] != null && parseInt(data['image']['width']) < 380) {
					e = $('<a class="article_small" href="'+decodeURI(data['url'])+'" target="_blank">'+preview+title+description+'<div class="base_url">'+base_url+'</div></a>');
				} 
			}
		} else {
			e = Filter.fail_request(data['url']);
		}
		return e;
	},

	searchLink : function(inner, ending) {
		var baliseId = createId();
		var r1 = /[\s]*https?:\/\/[^\s]+/gi;
		if(!ending) {
			r1 = new RegExp(r1+'[\s]','gi');
		}
		substitution = function(str) {
			//output = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+str2md5(str.replace(/#.+$/,''))+'"><img src="Assets/ajax-loader.gif"/></span>';
			output = '<span class="deletable" data-src="'+str+'" contenteditable="false" id="'+baliseId+'"><img src="Assets/ajax-loader.gif"/></span>';
			return output;
		};
		var ajax_url = "Ajax/post.php";
		var ajax_var = {"action":"gen_preview"};
		callback = function(data) {
			console.log(data);
			if(typeof(data['info']) != "undefined" && data['info'] == "extensionless") {
				switch(data['type']) {
					case "image" :
						e = '<img class="zoomPossible" onclick="lightbox.enlighten(this)" onerror="error_im(this)" src="'+data['url']+'"/>';
						balise = $('#'+baliseId);
						balise.html(e);
						break;
					case "video" :
						e = '<video autoplay loop><source src="'+str+'"></video>';
						balise = $('#'+baliseId);
						balise.html(e);
						break;
					default :
						e = Filter.fail_request(url);
						balise = $('#'+baliseId);
						balise.html(e);
						break;
				}
			} else {
				e = Filter.open_graph_build(data);
				//balise = $('#'+baliseId+'[data-src="'+data['url']+'"]');
				balise = $('*[data-src="'+data['url']+'"]');
				balise.html(e);
			}
		};
		fail = function(url) {
			console.log("fail");
			e = Filter.fail_request(url);
			balise = $('#'+baliseId);
			balise.html(e);
		}
		output = Control.searchMatch({"callerName":"searchLink", "inner":inner, "regex":r1, "substitution":substitution, "ajax_var":ajax_var, "ajax_url":ajax_url, "callback":callback, "fail":fail});
		return output;
	}
}
