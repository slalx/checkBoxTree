## 综述

checkBoxTree是一个多选树形控件，事例中展示是中国的地区，开发者可以感觉自己的需求，把data.js中的数据换成自己的就行了。

## 快速使用

### 初始化组件

     var checkBoxTree = new CheckBoxTree('#J_WT_MuliTree');


        checkBoxTree.on('leafSelected',function(ev){
            S.log('leafSelected');
            var checkboxNode = Node.one(ev.checkbox);
            var id = checkboxNode.val();
            var name = checkboxNode.attr('data-text');

             alert('选择的id:'+id+',name:'+name);   
        });
        checkBoxTree.on('leafDeSelected',function(ev){
            S.log('leafDeSelected');
            var checkboxNode = Node.one(ev.checkbox);
            var id = checkboxNode.val();
            var domEl = document.getElementById('selected_leaf_'+id);
            var nodeEl = Node.one(domEl);
            alert('取消选择的id:'+id);
        });

## API说明
参数名 | 类型 | 默认值 | 描述 
------------ | ------------- | ------------ | ------------ 
containerId | String   | '' | 组件容器id


### 事件说明

事件名 | 类型 | 默认值 | 描述 
------------ | ------------- | ------------ | ------------ 
leafSelected | String   | '' | 选中叶子节点时触发该事件，事件对象会传checkbox对象
leafDeSelected | String  | ''  |  取消叶子节点选中时触发该事件，事件对象会传checkbox对象