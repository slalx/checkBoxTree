/**
 * @fileoverview 
 * @author 知了<zhiliao.zsl@taobao.com>
 * @module checkBoxTree
 **/
KISSY.add(function (S, Base, Node, PCData, Render) {
    "use strict";


    /**
     * 多选树形控件
     * @class CheckBoxTree
     * @constructor
     * @extends S.Base
     */
    function CheckBoxTree(id, cfg) {
        if (this instanceof CheckBoxTree) {
            this.ele = Node.one(id);
            CheckBoxTree.superclass.constructor.call(this, cfg);
            this.init();
        } else {
            return new CheckBoxTree(id, cfg);
        }
    }


    S.extend(CheckBoxTree, Base, {

        init: function() {
            this.render();
            this._bind();
        },
        render: function(){
            var treeRender = new Render();
            var indexData = PCData.indexData;
            var proCityData = PCData.CPD_PY;
            var treeHTML = treeRender.build(indexData, proCityData);

            this.render = treeRender;
            //全部标签

            this.ele.html(treeHTML);
        },
        _bind: function(){
            var listtree = this.ele.all('.list-container');
            var lastSelectedNode = this.ele.one('.wordfilter .all');
            listtree.delegate('click','.list-tree>li span, .wordfilter a,.list-tree>li ul ',function(ev){

                var targetNode = Node.one(ev.target);

                //处理展开收起逻辑
                var spanParent = targetNode.closest('span');
                if(spanParent){
                    this._toggle(spanParent);
                    return;
                }

                //处理筛选逻辑
                if(targetNode.prop('tagName')=='A'){
                    if(targetNode.hasClass('gray')){
                        return;
                    }
                    var index = targetNode.html();

                    lastSelectedNode.removeClass('selected');
                    targetNode.addClass('selected');
                    lastSelectedNode = targetNode;
                    if(index == '全部'){
                        this.renderAllTree();
                    }else{
                        this.renderFilterTree(index);
                    }
                }

                //处理选中逻辑
                var labelParent = targetNode.closest('label');
                //fix checkbox不能选的bug
                if(targetNode.prop('tagName')=='LABEL'){
                    ev.preventDefault();
                }
                if(labelParent){
                    this._selectItems(labelParent,targetNode);
                    return;
                }
                
            },this);
        },
        _toggle: function(spanP){
            var li = spanP.parent();
            if(li){
                li.toggleClass('expand');
            }
        },
        renderFilterTree: function(index){
            var pcData = PCData.CPD_PY;
            var treeHTML = this.render.buildFilterTree(index,pcData);
            Node.one('.list-tree').html(treeHTML);
        },
        renderAllTree: function(){
            var indexData = PCData.indexData;
            var proCityData = PCData.CPD_PY;
            var allTreeHTML = this.render.buildAllTree(indexData,proCityData);

            Node.one('.list-tree').outerHTML(allTreeHTML);
        },
        _selectItems: function(labelParent,targetNode){
            var liP = labelParent.parent(),
            targetNodeTag = targetNode.prop('tagName');

            //fix checkbox不能选的bug,这种解决方案比较蛋疼
            if(targetNodeTag=='INPUT'){
                if(targetNode[0].checked){
                    targetNode[0].checked = false;
                }else{
                    targetNode[0].checked = true;
                }
            }

            if(liP.hasClass('all')){
                var checkboxes = liP.parent().all('input');
                //返回 全部省份checkbox的选中状态
                var allChecked = this._toggleOneItem(liP);
                this._toggleAllItems(checkboxes,allChecked);
            }else{
                this._toggleOneItem(liP);
            }
        },
        //
        _toggleOneItem: function(liP){
            var checkBox = liP.all('input')[0];

            if(checkBox.checked){
                checkBox.checked = false;
                this.handleAll(liP, false);
                this.fire('leafDeSelected',{
                    checkbox: checkBox
                });
            }else{
                checkBox.checked = true;
                this.handleAll(liP, true);
                this.fire('leafSelected',{
                    checkbox: checkBox
                });
            }
            return checkBox.checked;
        },

        _toggleAllItems: function(inputs,checkedAll){
            for (var i = 0; i < inputs.length; i++) {
                var checkbox = inputs[i];
                if(i !== 0){
                    if(checkedAll){
                        checkbox.checked = true;
                        this.fire('leafSelected',{
                            checkbox: checkbox
                        });
                    }else{
                        checkbox.checked = false;
                        this.fire('leafDeSelected',{
                            checkbox: checkbox
                        });
                    }
                }
            }
        },
        //点击除all之外的叶子节点时，all节点是否选中或者取消
        handleAll: function(li,checked){

            if(li.hasClass('all')){
                return;
            }

            var siblings = li.siblings(), 
            length = siblings.length-1,
            all = [],
            allLi = li.siblings('.all');
            S.each(siblings, function(obj,index){
                var liNode = Node.one(obj);
                var checkBox = liNode.all('input')[0];
                if(!liNode.hasClass('all')){
                    //如果要选择某一项
                    if(checked){
                        //查看除all之外的其他兄弟节点，是否都已经选择
                        if(checkBox.checked){
                            all.push(obj);
                        }
                    }else{
                        if(!checkBox.checked){
                            all.push(obj);
                        }
                    }
                }
            });
            if(length === all.length){
                //如果
                var allcheckbox = allLi.all('input')[0];
                if(checked){
                    allcheckbox.checked = true;
                }else{//如果
                    allcheckbox.checked = false;
                }
            }
        }
    },{
        ATTRS:{

        }
    });

    return CheckBoxTree;
}, {requires:['base','node','./data','./render','sizzle']});



