/*
 * ------------------------------------------
 * 列表模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _r = NEJ.R,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _i = _('nej.ui'),
        _p = _('nej.ut'),
        _proListModuleWF;
    if (!!_p._$$ListModuleWF) return;
    /**
     * 列表模块基类
     * 
     * 结构举例：
     * [code type="html"]
     *   <div class="mbox">
     *     <div class="lbox" id="list-box">
     *       <!-- list box -->
     *     </div>
     *     <div class="mbtn" id="more-btn"> load more button </div>
     *   </div>
     *   
     *   <!-- list jst template -->
     *   <textarea name="jst" id="jst-list">
     *     {list beg..end as y}
     *       {var x=xlist[y]}
     *       <div class="item">
               <a data-id="${x.id|x.name}" data-action="delete">删除</a>
     *         <p>姓名：${x.name}</p>
     *         <p>联系方式：${x.mobile}</p>
     *       </div>
     *     {/list}
     *   </textarea>
     * [/code]
     * 
     * 脚本举例：
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _j = _('nej.j'),
     *       _t = _('nej.ut'),
     *       _p = _('t.d'),
     *       _proCustomListCache;
     *   // 自定义列表缓存
     *   _p._$$CustomListCache = NEJ.C();
     *     _proCustomListCache = _p._$$CustomListCache
     *                             ._$extend(_t._$$AbstractListCache);
     *   // 实现数据载入逻辑
     *   _proCustomListCache.__doLoadList = function(_options){
     *       var _onload = _options.onload;
     *       // 补全请求数据，也可在模块层通过cache参数传入
     *       var _data = _options.data||{};
     *       NEJ.X(_data,{uid:'ww',sort:'xx',order:1});
     *       switch(_options.key){
     *              case 'user-list':
     *               // TODO load list from server
     *               _j._$request('/api/user/list',{
     *                   type:'json',
     *                   data:_u._$object2query(_data),
     *                   onload:function(_json){
     *                          // _json.code
     *                       // _json.result
     *                          _onload(_json.code==1?_json.result:null);
     *                   },
     *                   onerror:_onload._$bind(null);
     *               });
     *           break;
     *           // TODO other list load
     *       }
     *   };
     * [/code]
     * 
     * 脚本举例：
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _e = _('nej.e'),
     *       _t = _('nej.ut'),
     *       _d = _('t.d');
     *   // 构建列表模块，使用JST模版
     *   _t._$$ListModuleWF._$allocate({
     *       limit:5,
     *       parent:'list-box',
     *       more:'more-btn',
     *       item:'jst-list',
     *       cache:{
     *           key:'user-list',// 此key必须是唯一的，对应了item中的值,也是删除选项的data-id
     *           data:{uid:'ww',sort:'xx',order:1}, // <--- 列表加载时携带数据信息，此数据也可在cache层补全
     *           klass:_d._$$CustomListCache
     *       }
     *   });
     * [/code]
     * 
     * @class   {nej.ut._$$ListModuleWF}
     * @extends {nej.ut._$$ListModule}
     * @param   {Object}             可选配置参数
     * @config  {String|Node}  more  添加更多列表项按钮节点
     * 
     */
    _p._$$ListModuleWF = NEJ.C();
      _proListModuleWF = _p._$$ListModuleWF._$extend(_p._$$ListModule);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proListModuleWF.__reset = function(_options){
        this.__supReset(_options);
        this.__doResetMoreBtn(_options.more);
        this._$refresh();
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proListModuleWF.__destroy = function(){
        this.__supDestroy();
        delete this.__nmore;
    };
    /**
     * 重置载入更多按钮
     * @param  {String|Node} 按钮节点
     * @return {Void}
     */
    _proListModuleWF.__doResetMoreBtn = function(_more){
        this.__nmore = _e._$get(_more);
        this.__doInitDomEvent([[
            this.__nmore,'click',
            this._$next._$bind(this)
        ]]);
    };
    /**
     * 加载数据之前处理逻辑，显示数据加载中信息
     * @protected
     * @method {__doBeforeListLoad}
     * @return {Void}
     */
    _proListModuleWF.__doBeforeListLoad = function(){
        this.__doShowMessage('onbeforelistload','列表加载中...');
        _e._$setStyle(this.__nmore,'visibility','hidden');
    };
    /**
     * 数据载入之后处理逻辑
     * @protected
     * @method {__doBeforeListShow}
     * @return {Void}
     */
    _proListModuleWF.__doBeforeListShow = function(){
        var _event = {
            parent:this.__lbox
        };
        this._$dispatchEvent('onafterlistload',_event);
        if (!_event.stopped){
            _e._$removeByEC(this.__ntip);
        }
    };
    /**
     * 列表绘制之前处理逻辑
     * @protected
     * @method {__doBeforeListRender}
     * @return {Void}
     */
    _proListModuleWF.__doBeforeListRender = function(_list,_offset,_limit){
        var _length = _list.length;
        this.__offset = Math.min(this.__offset,_length);
        _e._$setStyle(this.__nmore,'visibility',
           _offset+_limit>_length?'hidden':'visible');
    };
    /**
     * 列表为空时处理逻辑
     * @protected
     * @method {__doShowEmpty}
     * @return {Void}
     */
    _proListModuleWF.__doShowEmpty = function(){
        this.__doShowMessage('onemptylist','没有列表数据！');
    };
    /**
     * 通过事件回调检测显示信息
     * @protected
     * @method {__doShowMessage}
     * @param  {String} 事件名称
     * @param  {String} 默认显示内容
     * @param  {Object} 扩展信息
     * @return {Void} 
     */
    _proListModuleWF.__doShowMessage = function(_name,_default){
        var _event = {
            parent:this.__lbox
        };
        this._$dispatchEvent(_name,_event);
        if (!_event.stopped){
            var _msg = _event.value||_default;
            if (_u._$isString(_msg)){
                if (!this.__ntip)
                    this.__ntip = _e._$create('div');
                this.__ntip.innerHTML = _msg;
            }else{
                this.__ntip = _msg;
            }
            this.__lbox.appendChild(this.__ntip);
        }
    };
    /**
     * 以jst模版方式绘制列表
     * @protected
     * @method {__doShowListByJST}
     * @return {Void}
     */
    _proListModuleWF.__doShowListByJST = function(_html){
        this.__lbox.insertAdjacentHTML('beforeEnd',_html);
    };
    /**
     * 以item模版方式绘制列表
     * @protected
     * @method {__doShowListByItem}
     * @return {Void}
     */
    _proListModuleWF.__doShowListByItem = function(_items){
        this.__items = this.__items||[];
        _r.push.apply(this.__items,_items);
    };
    /**
     * 删除列表项回调，子类按需实现具体业务逻辑
     * @protected
     * @method {__cbItemDelete}
     * @return {Void}
     */
    _proListModuleWF.__cbItemDelete = function(_event){
        this.__doCheckResult(_event,'onafterdelete');
        if (_event.stopped) return;
        var _id = _event.data[this.__iopt.pkey];
        if (!!this.__items){
            var _item = _e._$getItemById(_id),
                _index = _u._$indexOf(this.__items,_item);
            if (_index>=0){
                this.__items.splice(_index,1);
                this.__offset -= 1;
            }
            _item._$recycle();
        }else{
            var _node = _e._$get(this.
                        __getItemBodyId(_id));
            if (!!_node) this.__offset -= 1;
            _e._$remove(_node);
        }
        if (this.__offset<=0) this._$next();
    };
    /**
     * 更新列表项回调
     * @protected
     * @method {__cbItemUpdate}
     * @return {Void}
     */
    _proListModuleWF.__cbItemUpdate = function(_event){
        this.__doCheckResult(_event,'onafterupdate');
        if (_event.stopped) return;
        var _id = _event.data[this.__iopt.pkey];
        if (!!this.__items){
            var _item = _e._$getItemById(_id);
            if (!!_item) _item._$refresh(_event.data);
        }else{
            var _node = _e._$get(_id+''+
                        _e._$getHtmlTemplateSeed());
            if (!_node) return;
            var _list = this.__cache._$getListInCache(_event.key),
                _index = _u._$indexOf(_list,_event.data);
            if (_index<0) return;
            var _html = _e._$getHtmlTemplate(this.__ikey,{
                    beg:_index,end:_index,xlist:_list
                });
            _node.insertAdjacentHTML('afterEnd',_html);
            _e._$remove(_node);
        }
    };
    /**
     * 载入更多列表
     * @method {_$next}
     * @return {Void}
     */
    _proListModuleWF._$next = function(){
        // update offset first for 
        // offset adjust after list loaded
        var _offset = this.__offset;
        this.__offset += this.__ropt.limit;
        this.__doChangeOffset(_offset);
    };
    /**
     * 模块刷新
     * @method {_$refresh}
     * @return {Void}
     */
    _proListModuleWF._$refresh = function(){
        this.__doClearListBox();
        this.__offset = 0;
        this._$next();
    };
};
NEJ.define('{lib}util/list/module.waterfall.js',
      ['{lib}util/list/module.js'],f);
