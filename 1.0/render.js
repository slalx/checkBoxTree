/**
 * @fileoverview 多选树形控件渲染器
 * @author zhiliao.zsl@taobao.com
 **/
KISSY.add(function (S, Base) {

	"use strict";

    var NO_INDEX_OBJECT = {4:0,5:0,6:0,10:0,12:0,14:0,16:0,17:0,19:0,22:0,23:0,24:0};


    /**
     * 多选树形控件渲染器
     * @class Render
     * @constructor
     * @extends S.Base
     */
	function Render(cfg) {
		if (this instanceof Render) {

			Render.superclass.constructor.call(this, cfg);

		} else {
			return new Render(cfg);
		}
	}


	S.extend(Render, Base, {

		init: function() {

		},
		build: function(indexData,pcData){
			var indexHTML = this._buildIndex(indexData);
			var treeHTML = this.buildAllTree(indexData,pcData);
			var containerHTML = '<div class="wt-citytree clearfix">'+
									'<div class="colwrap left-wrap">'+
										'<strong>请从下表中挑选</strong>'+
										'<div class="list-container">'+
										indexHTML + treeHTML +    
										'</div>'+
									'</div>'+
									/*'<div class="colwrap right-wrap">'+
										'<strong>已选择  国内市级行政区 </strong>'+
										'<a class="clearsel" href="#">清空</a>'+
										'<ul class="list-tree list-container docheck" id="J_MultiTree_SelectedItems">'+
										'</ul>'+
										'<div class="seltips">已经选中 <strong>0</strong> 个</div>'+
									'</div>'+
									'<input class="J_SelectedIds hide" type="text" value=""/>'+*/
								'</div>';
								return containerHTML;
		},
		_buildIndex: function(indexData){
			var listStr = '',
				indexClass ='';

			for (var i = 0; i < indexData.length; i++) {
				var index = indexData[i];
				if( i === 0) {
					indexClass = 'all selected';
				} else if (i === 1) {
					indexClass = 'number gray';
				} else if( i in NO_INDEX_OBJECT) {
					indexClass = 'gray';
				} else {
					indexClass = '';
				}
				listStr += '<a href="#"  class="'+indexClass+'" >'+index+'</a>';
			}

			var filterHtml = '<div class="wordfilter">'+listStr+'</div>';

			return filterHtml;
		},
		buildAllTree: function(indexData,pcData){
			var listArr = [];

			for (var i = 0; i < indexData.length; i++) {
				var index = indexData[i];
				if(!(i in NO_INDEX_OBJECT) && i !== 0 && i !== 1){
					listArr.push(this.buildFilterTree(index,pcData));
				}
			}

			var treeHTML = '<ul class="list-tree">'+listArr.join('')+'</ul>';
			return treeHTML;
		},
		_buildCity: function(onePcData,pcode){
			var listStr = '';
			var cityData = onePcData.city;
			if(cityData){
				for (var key in cityData) {
					var oneCity = cityData[key];
					listStr += '<li>'+
								'<label><input type="checkbox" data-text="'+oneCity.name+'" id="leaf_'+pcode+':'+oneCity.code+'" value="'+pcode+':'+oneCity.code+'" autocomplete="off" >'+oneCity.name+'</label>'+
								'</li>';
				}
			}else{
			listStr += '<li>'+
				'<label><input type="checkbox" data-text="'+onePcData.name+'" id="leaf_'+pcode+':'+onePcData.code+'" value="'+pcode+':'+onePcData.code+'" autocomplete="off" >'+onePcData.name+'</label>'+
				'</li>';
			}
			return listStr;
		},
		buildFilterTree : function(index,pcData){
			var listArr = [];
			for (var key in pcData) {
				var onePcData =  pcData[key];
				if(index == onePcData.pstart) {
					var cityStr = this._buildCity(onePcData,onePcData.code);
					listArr.push('<li class="">'+
									'<span>'+
									'<strong>'+onePcData.pstart+'</strong>'+
									'<a id="A" href="javascript:void(0);">'+onePcData.name+'</a>'+
									'<input type="checkbox"  value=""  autocomplete="off" class="hidden">'+
									'</span>'+
									'<ul>'+
									'<li class="all">'+
									'<label><input type="checkbox"  autocomplete="off" id="leaf_'+onePcData.code+':all">全部'+onePcData.name+'</label>'+
									'</li>'+
									cityStr + 
									'</ul>'+
								'</li>'
								);
				}
			}
			return listArr.join('');
		}

	},{
		ATTRS:{

		}
	});

	return Render;

}, {
	requires: ['base','node']
});


