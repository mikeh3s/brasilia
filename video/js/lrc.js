(function($){
	$.lrc = {
		handle: null, /* 定时执行句柄 */
		list: [], /* lrc歌词及时间轴数组 */
		regex: /^[^\[]*((?:\s*\[\d+\:\d+(?:\.\d+)?\])+)([\s\S]*)$/, /* 提取歌词内容行 */
		regex_time: /\[(\d+)\:((?:\d+)(?:\.\d+)?)\]/g, /* 提取歌词时间轴 */
		regex_trim: /^\s+|\s+$/, /* 过滤两边空格 */
		callback: null, /* 定时获取歌曲执行时间回调函数 */
		interval: 0.3, /* 定时刷新时间，单位：秒 */
		format: '<li>{html}</li>', /* 模板 */
		prefixid:'lrc', /* 容器id */
		lyricContainer: $('#no-lrc').get(0),
		hoverClass: 'on', /* 选中节点的className */
		hoverTop: 100, /* 当前歌词距离父节点的高度 */
		duration: 0, /* 歌曲回调函数设置的进度时间 */
		__duration: -1, /* 当前歌曲进度时间 */
		/*获取歌词*/ 
		start: function(url, callback) {
            console.log(url);
			if(typeof(callback) != 'function') return;
			/* 停止前面执行的歌曲 */
			this.stop();
			this.callback = callback;
			this.getLyric(url); //获取歌词
		},
		getLyric: function(url) {
            var that = this,
                request = new XMLHttpRequest();
//            console.log('/audio/getlyric?url=' + url);

            request = $.ajax({
                method: 'get',
                url: "AudioController.php",
                contentType:"application/x-www-form-urlencoded; charset=gb2312",
                data:'url=' + url
            });

            request.success(function(data){
                //console.dir(data);
                if(data){
                    that.lyric = that.parseLyric(request.responseText, that);
                }
            })
            request.error(function(){
                $('#'+this.prefixid+'Box').hide();
                $('#no-lrc').show();
                that.lyricContainer.innerHTML = 'No lyric';
                return;
            })
        },
        parseLyric: function(text, that) {
            var lines = text.split('\n'),
                pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
                noScrollPattern = /^[\[]{1}/g,
                html = '',
                item = null,
                item_time = null;
            while (lines[0] == '') {
                lines = lines.slice(1);
            } //第一行有可能会为空*/
            if (pattern.test(lines[0]) && lines.length == 1 || lines[0] == 'No lyric') {
                //歌词文件中只有一行,不提供具体歌词
                $('#'+this.prefixid+'Box').hide();
                $('#no-lrc').show();
                that.lyricContainer.innerHTML= 'No lyric';
                return;
            } else if (!noScrollPattern.test(lines[0])) {
                //不支持滚动歌词
                that.lyricContainer.innerHTML= 'No lyric';
                $('#'+this.prefixid+'Box').hide();
                $('#no-lrc').show();
                return;
            }
            while (!pattern.test(lines[0])) {
                lines = lines.slice(1);
            }
            for(var i = 0; i < lines.length; i++) {
				item =lines[i].replace(this.regex_trim, '');
				if(item.length < 1 || !(item = this.regex.exec(item))) {
                   continue;
				} 
				while(item_time = this.regex_time.exec(item[1])) {
					this.list.push([parseFloat(item_time[1])*60+parseFloat(item_time[2]), item[2]]);
				}
				this.regex_time.lastIndex = 0;
			}
            if(this.list.length > 0) {
				this.list.sort(function(a,b){ return a[0]-b[0]; });// 对时间轴排序 
				if(this.list[0][0] >= 0.1) { 
					this.list.unshift([this.list[0][0]-0.1, '']);
				}
				this.list.push([this.list[this.list.length-1][0]+1, '']);
				for(var i = 0; i < this.list.length; i++) {
					html += this.format.replace(/\{html\}/gi, this.list[i][1]);
				}
				/* 赋值到指定容器 */
				$('#'+this.prefixid+'Box').html(html).animate({ marginTop: 0 }, 100).show();
				/* 隐藏没有歌词的层 */
				$('#no-lrc').hide();
				/* 定时调用回调函数，监听歌曲进度 */
				this.handle = setInterval('$.lrc.jump($.lrc.callback());', this.interval*1000);
			    } else{ 
				    $('#'+this.prefixid+'Box').hide();
				    $('#no-lrc').show();
			    }
        }, 
		/* 跳到指定时间的歌词 */
		jump: function(duration) {
			if(typeof(this.handle) != 'number' || typeof(duration) != 'number' || !$.isArray(this.list) || this.list.length < 1) return this.stop();
			if(duration < 0) duration = 0;
			if(this.__duration == duration) return;
			duration += 0.2;
			this.__duration = duration;
			duration += this.interval;
 
			var left = 0, right = this.list.length-1, last = right
				pivot = Math.floor(right/2),
				tmpobj = null, tmp = 0, thisobj = this;
 
			/* 二分查找 */
			while(left <= pivot && pivot <= right) {
				if(this.list[pivot][0] <= duration && (pivot == right || duration < this.list[pivot+1][0])) {
					//if(pivot == right) this.stop();
					break;
				}else if( this.list[pivot][0] > duration ) { /* left */
					right = pivot;
				}else{ /* right */
					left = pivot;
				}
				tmp = left + Math.floor((right - left)/2);
				if(tmp == pivot) break;
				pivot = tmp;
			}
 
			if(pivot == this.pivot) return;
			this.pivot = pivot;
			tmpobj = $('#'+this.prefixid+'Box').children().removeClass(this.hoverClass).eq(pivot).addClass(thisobj.hoverClass);
			tmp = tmpobj.next().offset().top-tmpobj.parent().offset().top - this.hoverTop;
			tmp = tmp > 0 ? tmp * -1 : 0;
			this.animata(tmpobj.parent()[0]).animate({marginTop: tmp + 'px'}, this.interval*1000);
		},
		/* 停止执行歌曲 */
		stop: function() {
			if(typeof(this.handle) == 'number') {
				clearInterval(this.handle);
			}
			this.handle = this.callback = null;
			this.__duration = -1;
			this.regex_time.lastIndex = 0;
			this.list = [];
		},
		animata: function(elem) {
			var f = j = 0, callback, _this={},
				tween = function(t,b,c,d){ return -c*(t/=d)*(t-2) + b; }
			_this.execution = function(key, val, t) {
				var s = (new Date()).getTime(), d = t || 500,
				    b = parseInt(elem.style[key]) || 0,
				    c = val-b;
				(function(){
					var t = (new Date()).getTime() - s;
					if(t>d){
						t=d;
						elem.style[key] = tween(t,b,c,d) + 'px';
						++f == j && callback && callback.apply(elem);
						return true;
					}
					elem.style[key] = tween(t,b,c,d)+'px';
					setTimeout(arguments.callee, 10);
				})();
			}
			_this.animate = function(sty, t, fn){
				callback = fn;
				for(var i in sty){
					j++;
					_this.execution(i,parseInt(sty[i]),t);
				}
			}
			return _this;
		}
	};
})(jQuery);
