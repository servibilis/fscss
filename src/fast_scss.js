
import * as parser from "./scss_parser.js"

/**
 * save css styles from DevTools
 */
export default class fscss{
	/**
	 * load file
	 */
	static getText(href){
		let request = new XMLHttpRequest();
		request.open('GET', href, false);
		request.send(null);
		if (request.status === 200) {
			return request.responseText;
			}
		return "";
		}
	/**
	 * get new css props after mutation
	 */
	static get_css_properties_for_element(element){
		let copystyle = typeof(element.dataset.copystyle)!="undefined"?parser.trim(element.dataset.copystyle):false;
		let style = element.getAttribute('style');
		if(style!=null){
			style = parser.scss_to_array(parser.trim(style));
			if(typeof(style['style'])!="undefined"){
				style = style['style'];
				}
			}
		else{
			return {};
			}
		if(Object.keys(style).length>0 && copystyle!=false && copystyle!="" ){
			let aout = {};
			copystyle = parser.scss_to_array(parser.trim(copystyle));
			if(typeof(copystyle['style'])!="undefined"){
				copystyle = copystyle['style'];
				for(let key in style){
					if(typeof(copystyle[key])=='undefined'||style[key]!=copystyle[key]){
						aout[key] = style[key];
						}
					}
				}
			return aout;
			}
		return style;
		}
	static getCustomProp(e,name){
		let compStyle = window.getComputedStyle(e);
		let v = compStyle.getPropertyValue(name);
		if(e.parentElement!==null){
			return window.getComputedStyle(e.parentElement).getPropertyValue(name)!=v?v:false;
			}
		return v;
		}
	/**
	 * create array for create element selector, work recursive 
	 */
	static getSelectorForElement(e,array_class_exclude=[],prevsel=[],recursive=true,to_root=false){

		// debugger;
		let compStyle = window.getComputedStyle(e);

		if(to_root==false&&prevsel.length==0){
			to_root=parseInt(fscss.getCustomProp(e,'--to_root'))>0;
			}
		let tagName = e.tagName.toLowerCase();
		let stop = parseInt(fscss.getCustomProp(e,'--stop'))>0;
		if(tagName=='body'){
			stop=true;
			}

		if(recursive===true&&prevsel.length!=0){
			let skip = parseInt(fscss.getCustomProp(e,'--skip'))>0;
			if(skip===true||(to_root===true&&stop===false)){
				return fscss.getSelectorForElement(e.parentElement,array_class_exclude,prevsel,recursive,to_root);
				}
			}


		let prefix = fscss.getCustomProp(e,'--prefix');
		let suffix = fscss.getCustomProp(e,'--suffix');
		let add_tag = parseInt(fscss.getCustomProp(e,'--add_tag'))>0;

		let selector = add_tag===true?tagName:"";
		let id = e.id.trim();
		let cl = e.className.toLowerCase().trim();

		if(id!=""){
			selector+="#"+id;
			}
		cl = cl.split(/\s+/);
		for(let i  in cl){
			if(cl[i]!="" && array_class_exclude.indexOf(cl[i])<0){
				selector+="."+cl[i];
				}
			}

		if(selector==="" && prevsel.length===0 ){
			selector=tagName;
			}
		if(prefix!==false&&prefix!=""){
			prefix = prefix.replace(/\s*['||"]\s*$/,"");
			prefix = prefix.replace(/^\s*['||"]\s*/,"");
			selector = prefix+selector;
			}
		if(suffix!==false&&suffix!=""){
			suffix = suffix.replace(/\s*['||"]\s*$/,"");
			suffix = suffix.replace(/^\s*['||"]\s*/,"");
			selector += suffix;
			}

		// if(e.parentElement.querySelector(':active') === e){
		//     selector+=":active";
		//     }
		// if(e.parentElement.querySelector(':focus') === e){
		//     selector+=":focus";
		//     }
		// if(e.parentElement.querySelector(':visited') === e){
		//     selector+=":visited";
		//     }
		// if(e.parentElement.querySelector(':hover') === e){
		//     selector+=":hover";
		//     }

		if(selector!=""){
			prevsel.unshift(selector);
			}
		if(recursive===true && stop===false){
			return fscss.getSelectorForElement(e.parentElement,array_class_exclude,prevsel,recursive,to_root);
			}
		return prevsel;
		}





















	/**
	 * create instance for fscss
	 * @param get_fscss - get code fscss
	 * @param set_fscss - function for save fscss
	 * @param set_scss -  function for save scss
	 * @param show_save_button=false - show button with click run fn_set_fscss && fn_set_scss
	 * @param key_save_css='F6' - button with key press run fn_set_fscss && fn_set_scss
	 * @param array_class_exclude=[]
	 * @param progressive_sizes=[576,768,992,1200] - we can set style like - font-size : 14px|16px|18px|20px|24px
	 */
	constructor(props){
		let fn_get_fscss = typeof props.get_fscss!="undefined"?props.get_fscss:false;
		let fn_set_fscss = typeof props.set_fscss!="undefined"?props.set_fscss:false;
		let fn_set_scss = typeof props.set_scss!="undefined"?props.set_scss:false;
		let show_save_button = typeof props.show_save_button!="undefined"?props.show_save_button:true;
		let key_save_css = typeof props.key_save_css!="undefined"?props.key_save_css:'F6';
		let array_class_exclude = Array.isArray(props.array_class_exclude)===true?props.array_class_exclude:[];
		let progressive_sizes = Array.isArray(props.progressive_sizes)===true?props.progressive_sizes:[576,768,992,1200];
		this.controll_words = ['--add_tag','--stop','--skip','--to_root','--prefix','--suffix'];

		// check fn_get_fscss
		if((fn_get_fscss instanceof Function)===false){
			throw "fn_get_fscss is not function";
			}
		else{
			this.get = fn_get_fscss;
			}
		//check fn_set_fscss
		if((fn_set_fscss instanceof Function)===false ){
			throw "fn_set_fscss is not function";
			}
		else{
			this.set_fscss = fn_set_fscss;
			}
		//check fn_set_scss, not required
		this.set_scss = false;
		if((fn_set_scss instanceof Function)===true ){
			this.set_scss = fn_set_scss;
			}

		// save && set another params
		this.key_save_css = key_save_css.toLowerCase();
		this.array_class_exclude = array_class_exclude;
		this.progressive_sizes = progressive_sizes;
		this.button = show_save_button===true;
		this.obj_mutations = []; // DOM nodes which have mutations
		this.fname = Array.isArray(this.progressive_sizes)===true?"fscssprop":false;

		this.copyStyleSheets()
		//init button
		if(this.button===true){
			this.init_button();
			}
		//action keyup
		document.addEventListener('keyup',e => {
			if(e.key.toLowerCase()==this.key_save_css){
				this.save();
				}
			});
		//save old attribute style
		let elmnts = document.querySelectorAll('body,body *');
		for(let ei=0;ei<elmnts.length;ei++){
			if( typeof(elmnts[ei].attributes.style)!="undefined" ){
				elmnts[ei].dataset.copystyle = elmnts[ei].getAttribute('style');
				}
			}
		//mutations
		let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		this.dev_observer = new MutationObserver((mutations)=>{
			mutations.forEach((mutation)=>{
				// console.log(mutation);
				if(mutation.attributeName=="style"){
					mutation.target.dataset.mutation=1;
					if(this.button==true){
						document.getElementById('dev_save').className="show";
						}
					if(this.obj_mutations.indexOf(mutation.target)<0){
						this.obj_mutations[this.obj_mutations.length] = mutation.target;
						}
					}
				});
			});
		this.dev_observer.observe(document.body,{
			subtree: true,
			childList: true,
			attributes: true,
			attributeOldValue: true,
			attributeFilter: ["style"]
			});
		}
	copyStyleSheets(){
		this.Sheets = [];
		for(let i=0;i<document.styleSheets.length;i++){
			let sheet = document.styleSheets[i];
			this.Sheets[i] = {};
			try{
				for( let j in sheet.rules ){
					let selector = sheet.rules[j].selectorText;
					if(typeof selector!="undefined"){
						this.Sheets[i][selector] = sheet.rules[j].style.cssText;
						}
					}
				} catch (error) {
					console.error(error);
				}
			}
		// console.log( this.Sheets );
		}
	/**
	 * create button for save changes
	 */
	init_button(){
		let style = document.createElement("style");
		document.head.appendChild(style);
		style.sheet.insertRule("#dev_save{display:none;font-family: sans-serif;opacity:0.8;position:fixed;bottom:20px;right:20px;color:#fff;font-size:14px;line-height:2;background-color:#434343;padding:0px 15px}", 0);
		style.sheet.insertRule("#dev_save.show{display:block;}", 0);
		style.sheet.insertRule("#dev_save::before{content:'save';}", 0);
		style.sheet.insertRule("#dev_save:hover{cursor:pointer;;background-color:#000;transition:background-color 0.5s;}",0);
		let btn = document.createElement("div");
		btn.id = "dev_save";
		document.body.appendChild(btn);
		btn.addEventListener("click",()=>{
			if(confirm("save?")){
				this.save();
				document.getElementById('dev_save').className="";
				}
			});
		}
	/**
	 * create scss text from array
	 */
	array_to_css(arr,setprop=false,tabs="\n",tab="\t"){
		let str = "";
		if( typeof arr['style']!="undefined" ){
			for(let a in arr['style']){
				if(this.fname===false||setprop===false){
					str+=tabs+(arr['style'][a]!=""?a+":"+arr['style'][a]:a)+";";
					}
				else{
					str+=tabs+this.set_css_prop(a,arr['style'][a])+";";
					}
				}
			}
		if( typeof arr['child']!="undefined" ){
			for(let a in arr['child']){
				str += tabs+a+"{"+(typeof arr['child'][a]=='string'?arr['child'][a]:this.array_to_css(arr['child'][a],setprop,tabs+tab))+tabs+tab+"}";
				}
			}
		str = str.replace(/};+/g,"}");
		str = str.replace(/{;+/g,"{");
		str = str.replace(/;+/g,";");
		return str;
		}
	/**
	 * create css prop 
	 */
	set_css_prop(name,param){
		let l = param.length;
		let separators = [];
		let start_skip_symbol = false;
		let skip = false;
		for(let i=0;i<l;i++){
			let ltr = param[i];
			if(skip===true){
				skip=start_skip_symbol!=ltr;
				if(skip===false){
					start_skip_symbol = false;
					}
				continue;
				}
			else{
				skip=ltr=="'"||ltr=='"';
					if(skip===false && ltr=="|"){
						separators.push(i);
						}
				else{
					start_skip_symbol=ltr;
					continue;
					}
				}
			}
		if(separators.length>0){
			let params=[];
			let prev_pos = 0;
			for(let j=0;j<separators.length;j++){
				let tmp = param.substring(prev_pos,separators[j]);
				params.push(tmp!=""?tmp:"null");
				prev_pos = separators[j]+1;
				}
			params.push(param.substring(prev_pos));
			return "@include "+this.fname+"("+name+","+params.join(",")+")";
			}
		return (param!=""?name+":"+param:name);
		}
	/**
	 * apply all mutations
	 */
	applyMutations(oldStyles,w=0){
		if(typeof oldStyles=='undefined'){
			oldStyles = {'child':{},'style':{}};
			}
		for(let i=0;i<this.obj_mutations.length;i++){
			let obj = this.obj_mutations[i];
			if(parseInt(obj.dataset.mutation)===1){
				let selector = fscss.getSelectorForElement(obj,this.array_class_exclude);
				let styles = fscss.get_css_properties_for_element(obj);
				let l = selector.length;
				if(Object.keys(styles).length>0 && l>0){
					let tmp = oldStyles;
					for(let i=0;i<l;i++){
						let sel = selector[i];
						if(typeof tmp['child'][sel]=='undefined'){
							tmp['child'][sel] = {'child':{},'style':{}};
							}
						tmp=tmp['child'][sel];
						}
					tmp = parser.merge(tmp,{'child':{},'style':styles});
					}
				}
			}
		}
	/**
	 * add scss function for progressive enhancement
	 */
	include_propfn_scss(){
		let fntxt = "";
		if(this.progressive_sizes.length>0){
			fntxt = "@mixin "+this.fname+"($name,$def";
			let body = "#{$name}:#{$def};";
			for(let j=0;j<this.progressive_sizes.length;j++){
				let sz = this.progressive_sizes[j];
				fntxt+=", $p"+sz+":null";
				body+="\n\t@if $p"+sz+"!=null {\n\t\t@media (min-width:"+sz+"px){ #{\$name}:#{\$p"+sz+"}; } \n\t\t} "
				}
			fntxt+="){\n\t"+body+" \n\t}";
			}
		return fntxt;
		}

	static getElementBySelector(el,arr,j){
		if(j>=arr.length){
			return el;
			}
		if(typeof el.child[arr[j]] !="undefined"){
			return fscss.getElementBySelector(el.child[arr[j]],arr,j+1);
			}
		return false;
		}
	/**
	 * run save all - fscss - scss
	 */
	save(){
		Promise.resolve(this.get()).then((v)=>this.save_then(v));
		}
	save_then(txtfscss){
		if(typeof txtfscss!="string"){
			if(typeof txtfscss.data=="string"){
				txtfscss = txtfscss.data;
				}
			else{
				throw "get fscss function should return a string or Object with param data (for support axios) "
				}
			}
		let new_fscss = parser.scss_to_array(txtfscss);
		// apply changing in old selectors
		for(let i=0;i<document.styleSheets.length;i++){
			let sheet = document.styleSheets[i];
			if(typeof this.Sheets[i] !="undefined"){
				for( let j in sheet.rules ){
					let selector = sheet.rules[j].selectorText;
					if(typeof selector=="undefined"){
						continue;
						}
					let el = fscss.getElementBySelector(new_fscss,selector.split(/\s+/),0);
					if(el!==false){
						let oldCssText = this.Sheets[i][selector];
						if(typeof oldCssText !="undefined"){
							let newCssText = sheet.rules[j].style.cssText;
							if(oldCssText!=newCssText){
								oldCssText = parser.scss_to_array(oldCssText);
								newCssText = parser.scss_to_array(newCssText);
								let changedStyles = {};
								let ln = 0;
								for(let prop in newCssText.style){
									if(newCssText.style[prop]!=oldCssText.style[prop]){
										changedStyles[prop] = newCssText.style[prop];
										ln+=1;
										}
									}
								if(ln>0){
									for(let prop in changedStyles){
										el.style[prop] = changedStyles[prop];
										}
									}
								}
							}
						}
					}
				}
			}
		// apply style mutations
		this.applyMutations(new_fscss);
		this.set_fscss(this.array_to_css(new_fscss,false));
		this.save_scss(new_fscss);
		}
	/**
	 * save scss
	 */
	save_scss(new_fscss){
		if(this.set_scss!==false){
			let new_scss = this.array_to_css(new_fscss,true);
			if(this.fname!==false){
				new_scss = this.include_propfn_scss() + "\n" + new_scss;
				}
			this.set_scss(new_scss);
			}
		}
	}
