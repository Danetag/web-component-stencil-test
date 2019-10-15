'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Default style mode id
 */
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
const EMPTY_OBJ = {};

const isDef = (v) => v != null;
const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};

let scopeId;
let contentRef;
let hostTagName;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let isSvgMode = false;
const parsePropertyValue = (propValue, propType) => {
    // ensure this value is of the correct prop type
    if (propValue != null && !isComplexType(propValue)) {
        if ( propType & 4 /* Boolean */) {
            // per the HTML spec, any string value means it is a boolean true value
            // but we'll cheat here and say that the string "false" is the boolean false
            return (propValue === 'false' ? false : propValue === '' || !!propValue);
        }
        if ( propType & 2 /* Number */) {
            // force it to be a number
            return parseFloat(propValue);
        }
        if ( propType & 1 /* String */) {
            // could have been passed as a number or boolean
            // but we still want it as a string
            return String(propValue);
        }
        // redundant return here for better minification
        return propValue;
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
};
const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const HYDRATED_CLASS = 'hydrated';
const HYDRATE_ID = 's-id';
const HYDRATE_CHILD_ID = 'c-id';
const rootAppliedStyles = new WeakMap();
const registerStyle = (scopeId, cssText, allowCS) => {
    let style = styles.get(scopeId);
    {
        style = cssText;
    }
    styles.set(scopeId, style);
};
const addStyle = (styleContainerNode, cmpMeta, mode, hostElm) => {
    let scopeId =  getScopeId(cmpMeta.$tagName$);
    let style = styles.get(scopeId);
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
    styleContainerNode = (styleContainerNode.nodeType === 11 /* DocumentFragment */ ? styleContainerNode : doc);
    if (style) {
        if (typeof style === 'string') {
            styleContainerNode = styleContainerNode.head || styleContainerNode;
            let appliedStyles = rootAppliedStyles.get(styleContainerNode);
            let styleElm;
            if (!appliedStyles) {
                rootAppliedStyles.set(styleContainerNode, appliedStyles = new Set());
            }
            if (!appliedStyles.has(scopeId)) {
                {
                    {
                        styleElm = doc.createElement('style');
                        styleElm.setAttribute('data-styles', '');
                        styleElm.innerHTML = style;
                    }
                    {
                        styleElm.setAttribute(HYDRATE_ID, scopeId);
                    }
                    styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
                }
                if (appliedStyles) {
                    appliedStyles.add(scopeId);
                }
            }
        }
        else if ( !styleContainerNode.adoptedStyleSheets.includes(style)) {
            styleContainerNode.adoptedStyleSheets = [
                ...styleContainerNode.adoptedStyleSheets,
                style
            ];
        }
    }
    return scopeId;
};
const attachStyles = (elm, cmpMeta, mode) => {
    const scopeId = addStyle( elm.getRootNode(), cmpMeta);
    if ( cmpMeta.$flags$ & 10 /* needsScopedEncapsulation */) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        elm['s-sc'] = scopeId;
        elm.classList.add(scopeId + '-h');
    }
};
const getScopeId = (tagName, mode) => 'sc-' + ( tagName);
/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// const stack: any[] = [];
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
const h = (nodeName, vnodeData, ...children) => {
    let child = null;
    let slotName = null;
    let simple = false;
    let lastSimple = false;
    let vNodeChildren = [];
    const walk = (c) => {
        for (let i = 0; i < c.length; i++) {
            child = c[i];
            if (Array.isArray(child)) {
                walk(child);
            }
            else if (child != null && typeof child !== 'boolean') {
                if (simple = typeof nodeName !== 'function' && !isComplexType(child)) {
                    child = String(child);
                }
                if (simple && lastSimple) {
                    // If the previous child was simple (string), we merge both
                    vNodeChildren[vNodeChildren.length - 1].$text$ += child;
                }
                else {
                    // Append a new vNode, if it's text, we create a text vNode
                    vNodeChildren.push(simple ? newVNode(null, child) : child);
                }
                lastSimple = simple;
            }
        }
    };
    walk(children);
    if (vnodeData) {
        if ( vnodeData.name) {
            slotName = vnodeData.name;
        }
        {
            const classData = vnodeData.className || vnodeData.class;
            if (classData) {
                vnodeData.class = typeof classData !== 'object'
                    ? classData
                    : Object.keys(classData)
                        .filter(k => classData[k])
                        .join(' ');
            }
        }
    }
    const vnode = newVNode(nodeName, null);
    vnode.$attrs$ = vnodeData;
    if (vNodeChildren.length > 0) {
        vnode.$children$ = vNodeChildren;
    }
    {
        vnode.$name$ = slotName;
    }
    return vnode;
};
const newVNode = (tag, text) => {
    const vnode = {
        $flags$: 0,
        $tag$: tag,
        $text$: text,
        $elm$: null,
        $children$: null
    };
    {
        vnode.$attrs$ = null;
    }
    {
        vnode.$name$ = null;
    }
    return vnode;
};
const Host = {};
const isHost = (node) => {
    return node && node.$tag$ === Host;
};
/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
const setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
    if (oldValue === newValue) {
        return;
    }
    let isProp = isMemberInElement(elm, memberName);
    let ln = memberName.toLowerCase();
    if ( memberName === 'class') {
        const classList = elm.classList;
        const oldClasses = parseClassList(oldValue);
        const newClasses = parseClassList(newValue);
        classList.remove(...oldClasses.filter(c => c && !newClasses.includes(c)));
        classList.add(...newClasses.filter(c => c && !oldClasses.includes(c)));
    }
    else if ( !isProp && memberName[0] === 'o' && memberName[1] === 'n') {
        // Event Handlers
        // so if the member name starts with "on" and the 3rd characters is
        // a capital letter, and it's not already a member on the element,
        // then we're assuming it's an event listener
        if (memberName[2] === '-') {
            // on- prefixed events
            // allows to be explicit about the dom event to listen without any magic
            // under the hood:
            // <my-cmp on-click> // listens for "click"
            // <my-cmp on-Click> // listens for "Click"
            // <my-cmp on-ionChange> // listens for "ionChange"
            // <my-cmp on-EVENTS> // listens for "EVENTS"
            memberName = memberName.slice(3);
        }
        else if (isMemberInElement(win, ln)) {
            // standard event
            // the JSX attribute could have been "onMouseOver" and the
            // member name "onmouseover" is on the window's prototype
            // so let's add the listener "mouseover", which is all lowercased
            memberName = ln.slice(2);
        }
        else {
            // custom event
            // the JSX attribute could have been "onMyCustomEvent"
            // so let's trim off the "on" prefix and lowercase the first character
            // and add the listener "myCustomEvent"
            // except for the first character, we keep the event name case
            memberName = ln[2] + memberName.slice(3);
        }
        if (oldValue) {
            plt.rel(elm, memberName, oldValue, false);
        }
        if (newValue) {
            plt.ael(elm, memberName, newValue, false);
        }
    }
    else {
        // Set property if it exists and it's not a SVG
        const isComplex = isComplexType(newValue);
        if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
            try {
                if (!elm.tagName.includes('-')) {
                    let n = newValue == null ? '' : newValue;
                    // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                    // tslint:disable-next-line: triple-equals
                    if (oldValue == null || elm[memberName] != n) {
                        elm[memberName] = n;
                    }
                }
                else {
                    elm[memberName] = newValue;
                }
            }
            catch (e) { }
        }
        if (newValue == null || newValue === false) {
            {
                elm.removeAttribute(memberName);
            }
        }
        else if ((!isProp || (flags & 4 /* isHost */) || isSvg) && !isComplex) {
            newValue = newValue === true ? '' : newValue;
            {
                elm.setAttribute(memberName, newValue);
            }
        }
    }
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => (!value) ? [] : value.split(parseClassListRegex);
const updateElement = (oldVnode, newVnode, isSvgMode, memberName) => {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = (newVnode.$elm$.nodeType === 11 /* DocumentFragment */ && newVnode.$elm$.host) ? newVnode.$elm$.host : newVnode.$elm$;
    const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;
    {
        // remove attributes no longer present on the vnode by setting them to undefined
        for (memberName in oldVnodeAttrs) {
            if (!(memberName in newVnodeAttrs)) {
                setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
            }
        }
    }
    // add new & update changed attributes
    for (memberName in newVnodeAttrs) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
    }
};
const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
    // tslint:disable-next-line: prefer-const
    let newVNode = newParentVNode.$children$[childIndex];
    let i = 0;
    let elm;
    let childNode;
    let oldVNode;
    if ( !useNativeShadowDom) {
        // remember for later we need to check to relocate nodes
        checkSlotRelocate = true;
        if (newVNode.$tag$ === 'slot') {
            if (scopeId) {
                // scoped css needs to add its scoped id to the parent element
                parentElm.classList.add(scopeId + '-s');
            }
            newVNode.$flags$ |= (newVNode.$children$)
                // slot element has fallback content
                // still create an element that "mocks" the slot element
                ? 2 /* isSlotFallback */
                // slot element does not have fallback content
                // create an html comment we'll use to always reference
                // where actual slot content should sit next to
                : 1 /* isSlotReference */;
        }
    }
    if ( newVNode.$text$ !== null) {
        // create text node
        elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$);
    }
    else if ( newVNode.$flags$ & 1 /* isSlotReference */) {
        // create a slot reference node
        elm = newVNode.$elm$ =  doc.createComment(`slot-reference:${hostTagName.toLowerCase()}`) ;
    }
    else {
        // create element
        elm = newVNode.$elm$ = ( doc.createElement(( newVNode.$flags$ & 2 /* isSlotFallback */) ? 'slot-fb' : newVNode.$tag$));
        // add css classes, attrs, props, listeners, etc.
        {
            updateElement(null, newVNode, isSvgMode);
        }
        if ( isDef(scopeId) && elm['s-si'] !== scopeId) {
            // if there is a scopeId and this is the initial render
            // then let's add the scopeId as a css class
            elm.classList.add((elm['s-si'] = scopeId));
        }
        if (newVNode.$children$) {
            for (i = 0; i < newVNode.$children$.length; ++i) {
                // create the node
                childNode = createElm(oldParentVNode, newVNode, i, elm);
                // return node could have been null
                if (childNode) {
                    // append our new node
                    elm.appendChild(childNode);
                }
            }
        }
    }
    {
        elm['s-hn'] = hostTagName;
        if (newVNode.$flags$ & (2 /* isSlotFallback */ | 1 /* isSlotReference */)) {
            // remember the content reference comment
            elm['s-sr'] = true;
            // remember the content reference comment
            elm['s-cr'] = contentRef;
            // remember the slot name, or empty string for default slot
            elm['s-sn'] = newVNode.$name$ || '';
            // check if we've got an old vnode for this slot
            oldVNode = oldParentVNode && oldParentVNode.$children$ && oldParentVNode.$children$[childIndex];
            if (oldVNode && oldVNode.$tag$ === newVNode.$tag$ && oldParentVNode.$elm$) {
                // we've got an old slot vnode and the wrapper is being replaced
                // so let's move the old slot content back to it's original location
                putBackInOriginalLocation(oldParentVNode.$elm$, false);
            }
        }
    }
    return elm;
};
const putBackInOriginalLocation = (parentElm, recursive) => {
    plt.$flags$ |= 1 /* isTmpDisconnected */;
    const oldSlotChildNodes = parentElm.childNodes;
    for (let i = oldSlotChildNodes.length - 1; i >= 0; i--) {
        const childNode = oldSlotChildNodes[i];
        if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {
            // // this child node in the old element is from another component
            // // remove this node from the old slot's parent
            // childNode.remove();
            // and relocate it back to it's original location
            parentReferenceNode(childNode).insertBefore(childNode, referenceNode(childNode));
            // remove the old original location comment entirely
            // later on the patch function will know what to do
            // and move this to the correct spot in need be
            childNode['s-ol'].remove();
            childNode['s-ol'] = undefined;
            checkSlotRelocate = true;
        }
        if (recursive) {
            putBackInOriginalLocation(childNode, recursive);
        }
    }
    plt.$flags$ &= ~1 /* isTmpDisconnected */;
};
const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
    let containerElm = (( parentElm['s-cr'] && parentElm['s-cr'].parentNode) || parentElm);
    let childNode;
    if ( containerElm.shadowRoot && containerElm.tagName === hostTagName) {
        containerElm = containerElm.shadowRoot;
    }
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnodes[startIdx]) {
            childNode = createElm(null, parentVNode, startIdx, parentElm);
            if (childNode) {
                vnodes[startIdx].$elm$ = childNode;
                containerElm.insertBefore(childNode,  referenceNode(before) );
            }
        }
    }
};
const removeVnodes = (vnodes, startIdx, endIdx, vnode, elm) => {
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnode = vnodes[startIdx]) {
            elm = vnode.$elm$;
            {
                // we're removing this element
                // so it's possible we need to show slot fallback content now
                checkSlotFallbackVisibility = true;
                if (elm['s-ol']) {
                    // remove the original location comment
                    elm['s-ol'].remove();
                }
                else {
                    // it's possible that child nodes of the node
                    // that's being removed are slot nodes
                    putBackInOriginalLocation(elm, true);
                }
            }
            // remove the vnode's element from the dom
            elm.remove();
        }
    }
};
const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let node;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            // Vnode might have been moved left
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            if ( (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
            }
            patch(oldStartVnode, newEndVnode);
            parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            if ( (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
            }
            patch(oldEndVnode, newStartVnode);
            parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            {
                // new element
                node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
                newStartVnode = newCh[++newStartIdx];
            }
            if (node) {
                {
                    parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
                }
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        addVnodes(parentElm, (newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$), newVNode, newCh, newStartIdx, newEndIdx);
    }
    else if ( newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
};
const isSameVnode = (vnode1, vnode2) => {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    if (vnode1.$tag$ === vnode2.$tag$) {
        if ( vnode1.$tag$ === 'slot') {
            return vnode1.$name$ === vnode2.$name$;
        }
        return true;
    }
    return false;
};
const referenceNode = (node) => {
    // this node was relocated to a new location in the dom
    // because of some other component's slot
    // but we still have an html comment in place of where
    // it's original location was according to it's original vdom
    return (node && node['s-ol']) || node;
};
const parentReferenceNode = (node) => (node['s-ol'] ? node['s-ol'] : node).parentNode;
const patch = (oldVNode, newVNode) => {
    const elm = newVNode.$elm$ = oldVNode.$elm$;
    const oldChildren = oldVNode.$children$;
    const newChildren = newVNode.$children$;
    let defaultHolder;
    if ( newVNode.$text$ === null) {
        // element node
        {
            if ( newVNode.$tag$ === 'slot')
                ;
            else {
                // either this is the first render of an element OR it's an update
                // AND we already know it's possible it could have changed
                // this updates the element's css classes, attrs, props, listeners, etc.
                updateElement(oldVNode, newVNode, isSvgMode);
            }
        }
        if ( oldChildren !== null && newChildren !== null) {
            // looks like there's child vnodes for both the old and new vnodes
            updateChildren(elm, oldChildren, newVNode, newChildren);
        }
        else if (newChildren !== null) {
            // no old child vnodes, but there are new child vnodes to add
            if ( oldVNode.$text$ !== null) {
                // the old vnode was text, so be sure to clear it out
                elm.textContent = '';
            }
            // add the new vnode children
            addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
        }
        else if ( oldChildren !== null) {
            // no new child vnodes, but there are old child vnodes to remove
            removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
    }
    else if ( (defaultHolder = elm['s-cr'])) {
        // this element has slotted content
        defaultHolder.parentNode.textContent = newVNode.$text$;
    }
    else if ( oldVNode.$text$ !== newVNode.$text$) {
        // update the text content for the text only vnode
        // and also only if the text is different than before
        elm.data = newVNode.$text$;
    }
};
const updateFallbackSlotVisibility = (elm) => {
    // tslint:disable-next-line: prefer-const
    let childNodes = elm.childNodes;
    let childNode;
    let i;
    let ilen;
    let j;
    let slotNameAttr;
    let nodeType;
    for (i = 0, ilen = childNodes.length; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode.nodeType === 1 /* ElementNode */) {
            if (childNode['s-sr']) {
                // this is a slot fallback node
                // get the slot name for this slot reference node
                slotNameAttr = childNode['s-sn'];
                // by default always show a fallback slot node
                // then hide it if there are other slots in the light dom
                childNode.hidden = false;
                for (j = 0; j < ilen; j++) {
                    if (childNodes[j]['s-hn'] !== childNode['s-hn']) {
                        // this sibling node is from a different component
                        nodeType = childNodes[j].nodeType;
                        if (slotNameAttr !== '') {
                            // this is a named fallback slot node
                            if (nodeType === 1 /* ElementNode */ && slotNameAttr === childNodes[j].getAttribute('slot')) {
                                childNode.hidden = true;
                                break;
                            }
                        }
                        else {
                            // this is a default fallback slot node
                            // any element or text node (with content)
                            // should hide the default fallback slot node
                            if (nodeType === 1 /* ElementNode */ || (nodeType === 3 /* TextNode */ && childNodes[j].textContent.trim() !== '')) {
                                childNode.hidden = true;
                                break;
                            }
                        }
                    }
                }
            }
            // keep drilling down
            updateFallbackSlotVisibility(childNode);
        }
    }
};
const relocateNodes = [];
const relocateSlotContent = (elm) => {
    // tslint:disable-next-line: prefer-const
    let childNodes = elm.childNodes;
    let ilen = childNodes.length;
    let i = 0;
    let j = 0;
    let nodeType = 0;
    let childNode;
    let node;
    let hostContentNodes;
    let slotNameAttr;
    for (ilen = childNodes.length; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && (node = childNode['s-cr'])) {
            // first got the content reference comment node
            // then we got it's parent, which is where all the host content is in now
            hostContentNodes = node.parentNode.childNodes;
            slotNameAttr = childNode['s-sn'];
            for (j = hostContentNodes.length - 1; j >= 0; j--) {
                node = hostContentNodes[j];
                if (!node['s-cn'] && !node['s-nr'] && node['s-hn'] !== childNode['s-hn']) {
                    // let's do some relocating to its new home
                    // but never relocate a content reference node
                    // that is suppose to always represent the original content location
                    nodeType = node.nodeType;
                    if (((nodeType === 3 /* TextNode */ || nodeType === 8 /* CommentNode */) && slotNameAttr === '') ||
                        (nodeType === 1 /* ElementNode */ && node.getAttribute('slot') === null && slotNameAttr === '') ||
                        (nodeType === 1 /* ElementNode */ && node.getAttribute('slot') === slotNameAttr)) {
                        // it's possible we've already decided to relocate this node
                        if (!relocateNodes.some(r => r.$nodeToRelocate$ === node)) {
                            // made some changes to slots
                            // let's make sure we also double check
                            // fallbacks are correctly hidden or shown
                            checkSlotFallbackVisibility = true;
                            node['s-sn'] = slotNameAttr;
                            // add to our list of nodes to relocate
                            relocateNodes.push({
                                $slotRefNode$: childNode,
                                $nodeToRelocate$: node
                            });
                        }
                    }
                }
            }
        }
        if (childNode.nodeType === 1 /* ElementNode */) {
            relocateSlotContent(childNode);
        }
    }
};
const renderVdom = (hostElm, hostRef, cmpMeta, renderFnResults) => {
    hostTagName = hostElm.tagName;
    const oldVNode = hostRef.$vnode$ || newVNode(null, null);
    const rootVnode = isHost(renderFnResults)
        ? renderFnResults
        : h(null, null, renderFnResults);
    rootVnode.$tag$ = null;
    rootVnode.$flags$ |= 4 /* isHost */;
    hostRef.$vnode$ = rootVnode;
    rootVnode.$elm$ = oldVNode.$elm$ = ( hostElm.shadowRoot || hostElm );
    {
        scopeId = hostElm['s-sc'];
    }
    {
        contentRef = hostElm['s-cr'];
        useNativeShadowDom = supportsShadowDom ;
        // always reset
        checkSlotRelocate = checkSlotFallbackVisibility = false;
    }
    // synchronous patch
    patch(oldVNode, rootVnode);
    {
        if (checkSlotRelocate) {
            relocateSlotContent(rootVnode.$elm$);
            for (let i = 0; i < relocateNodes.length; i++) {
                const relocateNode = relocateNodes[i];
                if (!relocateNode.$nodeToRelocate$['s-ol']) {
                    // add a reference node marking this node's original location
                    // keep a reference to this node for later lookups
                    const orgLocationNode =  doc.createComment(`org-loc`)
                        ;
                    orgLocationNode['s-nr'] = relocateNode.$nodeToRelocate$;
                    relocateNode.$nodeToRelocate$.parentNode.insertBefore((relocateNode.$nodeToRelocate$['s-ol'] = orgLocationNode), relocateNode.$nodeToRelocate$);
                }
            }
            // while we're moving nodes around existing nodes, temporarily disable
            // the disconnectCallback from working
            plt.$flags$ |= 1 /* isTmpDisconnected */;
            for (let i = 0; i < relocateNodes.length; i++) {
                const relocateNode = relocateNodes[i];
                // by default we're just going to insert it directly
                // after the slot reference node
                const parentNodeRef = relocateNode.$slotRefNode$.parentNode;
                let insertBeforeNode = relocateNode.$slotRefNode$.nextSibling;
                let orgLocationNode = relocateNode.$nodeToRelocate$['s-ol'];
                while (orgLocationNode = orgLocationNode.previousSibling) {
                    let refNode = orgLocationNode['s-nr'];
                    if (refNode &&
                        refNode['s-sn'] === relocateNode.$nodeToRelocate$['s-sn'] &&
                        parentNodeRef === refNode.parentNode) {
                        refNode = refNode.nextSibling;
                        if (!refNode || !refNode['s-nr']) {
                            insertBeforeNode = refNode;
                            break;
                        }
                    }
                }
                if ((!insertBeforeNode && parentNodeRef !== relocateNode.$nodeToRelocate$.parentNode) ||
                    (relocateNode.$nodeToRelocate$.nextSibling !== insertBeforeNode)) {
                    // we've checked that it's worth while to relocate
                    // since that the node to relocate
                    // has a different next sibling or parent relocated
                    if (relocateNode.$nodeToRelocate$ !== insertBeforeNode) {
                        // add it back to the dom but in its new home
                        parentNodeRef.insertBefore(relocateNode.$nodeToRelocate$, insertBeforeNode);
                    }
                }
            }
            // done moving nodes around
            // allow the disconnect callback to work again
            plt.$flags$ &= ~1 /* isTmpDisconnected */;
        }
        if (checkSlotFallbackVisibility) {
            updateFallbackSlotVisibility(rootVnode.$elm$);
        }
        // always reset
        relocateNodes.length = 0;
    }
};
const attachToAncestor = (hostRef, ancestorComponent) => {
    if ( ancestorComponent && !hostRef.$onRenderResolve$) {
        ancestorComponent['s-p'].push(new Promise(r => hostRef.$onRenderResolve$ = r));
    }
};
const scheduleUpdate = (elm, hostRef, cmpMeta, isInitialLoad) => {
    {
        hostRef.$flags$ |= 16 /* isQueuedForUpdate */;
    }
    if ( hostRef.$flags$ & 4 /* isWaitingForChildren */) {
        hostRef.$flags$ |= 512 /* needsRerender */;
        return;
    }
    const ancestorComponent = hostRef.$ancestorComponent$;
    const instance =  hostRef.$lazyInstance$ ;
    const update = () => updateComponent(elm, hostRef, cmpMeta, instance, isInitialLoad);
    const rc = elm['s-rc'];
    attachToAncestor(hostRef, ancestorComponent);
    let promise;
    if (isInitialLoad) {
        {
            promise = safeCall(instance, 'componentWillLoad');
        }
    }
    if ( rc) {
        // ok, so turns out there are some child host elements
        // waiting on this parent element to load
        // let's fire off all update callbacks waiting
        rc.forEach(cb => cb());
        elm['s-rc'] = undefined;
    }
    // there is no ancestorc omponent or the ancestor component
    // has already fired off its lifecycle update then
    // fire off the initial update
    return then(promise,  () => writeTask(update)
        );
};
const updateComponent = (elm, hostRef, cmpMeta, instance, isInitialLoad) => {
    // updateComponent
    if ( isInitialLoad) {
        // DOM WRITE!
        attachStyles(elm, cmpMeta);
    }
    {
        {
            try {
                // looks like we've got child nodes to render into this host element
                // or we need to update the css class/attrs on the host element
                // DOM WRITE!
                renderVdom(elm, hostRef, cmpMeta,  instance.render() );
            }
            catch (e) {
                consoleError(e);
            }
        }
    }
    {
        hostRef.$flags$ &= ~16 /* isQueuedForUpdate */;
    }
    {
        try {
            // manually connected child components during server-side hydrate
            serverSideConnected(elm);
            if (isInitialLoad && (cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */)) {
                // using only during server-side hydrate
                elm['s-sd'] = true;
            }
        }
        catch (e) {
            consoleError(e);
        }
    }
    {
        hostRef.$flags$ |= 2 /* hasRendered */;
    }
    {
        const childrenPromises = elm['s-p'];
        const postUpdate = () => postUpdateComponent(elm, hostRef, cmpMeta);
        if (childrenPromises.length === 0) {
            postUpdate();
        }
        else {
            Promise.all(childrenPromises).then(postUpdate);
            hostRef.$flags$ |= 4 /* isWaitingForChildren */;
            childrenPromises.length = 0;
        }
    }
};
const postUpdateComponent = (elm, hostRef, cmpMeta) => {
    const ancestorComponent = hostRef.$ancestorComponent$;
    if (!(hostRef.$flags$ & 64 /* hasLoadedComponent */)) {
        hostRef.$flags$ |= 64 /* hasLoadedComponent */;
        {
            // DOM WRITE!
            // add the css class that this element has officially hydrated
            elm.classList.add(HYDRATED_CLASS);
        }
        {
            hostRef.$onReadyResolve$(elm);
            if (!ancestorComponent) {
                appDidLoad();
            }
        }
    }
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    {
        if (hostRef.$onRenderResolve$) {
            hostRef.$onRenderResolve$();
            hostRef.$onRenderResolve$ = undefined;
        }
        if (hostRef.$flags$ & 512 /* needsRerender */) {
            nextTick(() => scheduleUpdate(elm, hostRef, cmpMeta, false));
        }
        hostRef.$flags$ &= ~(4 /* isWaitingForChildren */ | 512 /* needsRerender */);
    }
    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
};
const appDidLoad = () => {
    // on appload
    // we have finish the first big initial render
    {
        doc.documentElement.classList.add(HYDRATED_CLASS);
    }
};
const safeCall = (instance, method, arg) => {
    if (instance && instance[method]) {
        try {
            return instance[method](arg);
        }
        catch (e) {
            consoleError(e);
        }
    }
    return undefined;
};
const then = (promise, thenFn) => {
    return promise && promise.then ? promise.then(thenFn) : thenFn();
};
const serverSideConnected = (elm) => {
    const children = elm.children;
    if (children != null) {
        for (let i = 0, ii = children.length; i < ii; i++) {
            const childElm = children[i];
            if (typeof childElm.connectedCallback === 'function') {
                childElm.connectedCallback();
            }
            serverSideConnected(childElm);
        }
    }
};
const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
const setValue = (ref, propName, newVal, cmpMeta) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const elm =  hostRef.$hostElement$ ;
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance =  hostRef.$lazyInstance$ ;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    if (newVal !== oldVal && ( !(flags & 8 /* isConstructingInstance */) || oldVal === undefined)) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        if ( instance) {
            // get an array of method names of watch functions to call
            if ( cmpMeta.$watchers$ && flags & 128 /* isWatchReady */) {
                const watchMethods = cmpMeta.$watchers$[propName];
                if (watchMethods) {
                    // this instance is watching for when this property changed
                    watchMethods.forEach(watchMethodName => {
                        try {
                            // fire off each of the watch methods that are watching this property
                            instance[watchMethodName](newVal, oldVal, propName);
                        }
                        catch (e) {
                            consoleError(e);
                        }
                    });
                }
            }
            if ( (flags & (2 /* hasRendered */ | 16 /* isQueuedForUpdate */)) === 2 /* hasRendered */) {
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(elm, hostRef, cmpMeta, false);
            }
        }
    }
};
const proxyComponent = (Cstr, cmpMeta, flags) => {
    if ( cmpMeta.$members$) {
        if ( Cstr.watchers) {
            cmpMeta.$watchers$ = Cstr.watchers;
        }
        // It's better to have a const than two Object.entries()
        const members = Object.entries(cmpMeta.$members$);
        const prototype = Cstr.prototype;
        members.forEach(([memberName, [memberFlags]]) => {
            if ( ((memberFlags & 31 /* Prop */) ||
                (( flags & 2 /* proxyState */) &&
                    (memberFlags & 32 /* State */)))) {
                // proxyComponent - prop
                Object.defineProperty(prototype, memberName, {
                    get() {
                        // proxyComponent, get value
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        // proxyComponent, set value
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true
                });
            }
        });
        if ( ( flags & 1 /* isElementConstructor */)) {
            const attrNameToPropName = new Map();
            prototype.attributeChangedCallback = function (attrName, _oldValue, newValue) {
                plt.jmp(() => {
                    const propName = attrNameToPropName.get(attrName);
                    this[propName] = newValue === null && typeof this[propName] === 'boolean'
                        ? false
                        : newValue;
                });
            };
            // create an array of attributes to observe
            // and also create a map of html attribute name to js property name
            Cstr.observedAttributes = members
                .filter(([_, m]) => m[0] & 15 /* HasAttribute */) // filter to only keep props that should match attributes
                .map(([propName, m]) => {
                const attrName = m[1] || propName;
                attrNameToPropName.set(attrName, propName);
                return attrName;
            });
        }
    }
    return Cstr;
};
const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId, Cstr) => {
    // initializeComponent
    if ( (hostRef.$flags$ & 32 /* hasInitializedComponent */) === 0) {
        // we haven't initialized this element yet
        hostRef.$flags$ |= 32 /* hasInitializedComponent */;
        if ( hostRef.$modeName$) {
            elm.setAttribute('s-mode', hostRef.$modeName$);
        }
        {
            // lazy loaded components
            // request the component's implementation to be
            // wired up with the host element
            Cstr = loadModule(cmpMeta);
            if (Cstr.then) {
                // Await creates a micro-task avoid if possible
                Cstr = await Cstr;
            }
            if ( !Cstr.isProxied) {
                // we'eve never proxied this Constructor before
                // let's add the getters/setters to its prototype before
                // the first time we create an instance of the implementation
                {
                    cmpMeta.$watchers$ = Cstr.watchers;
                }
                proxyComponent(Cstr, cmpMeta, 2 /* proxyState */);
                Cstr.isProxied = true;
            }
            // ok, time to construct the instance
            // but let's keep track of when we start and stop
            // so that the getters/setters don't incorrectly step on data
            {
                hostRef.$flags$ |= 8 /* isConstructingInstance */;
            }
            // construct the lazy-loaded component implementation
            // passing the hostRef is very important during
            // construction in order to directly wire together the
            // host element and the lazy-loaded instance
            try {
                new Cstr(hostRef);
            }
            catch (e) {
                consoleError(e);
            }
            {
                hostRef.$flags$ &= ~8 /* isConstructingInstance */;
            }
            {
                hostRef.$flags$ |= 128 /* isWatchReady */;
            }
        }
        const scopeId =  getScopeId(cmpMeta.$tagName$);
        if ( !styles.has(scopeId) && Cstr.style) {
            // this component has styles but we haven't registered them yet
            let style = Cstr.style;
            registerStyle(scopeId, style);
        }
    }
    // we've successfully created a lazy instance
    const ancestorComponent = hostRef.$ancestorComponent$;
    const schedule = () => scheduleUpdate(elm, hostRef, cmpMeta, true);
    if ( ancestorComponent && ancestorComponent['s-rc']) {
        // this is the intial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        ancestorComponent['s-rc'].push(schedule);
    }
    else {
        schedule();
    }
};
const connectedCallback = (elm, cmpMeta) => {
    if ((plt.$flags$ & 1 /* isTmpDisconnected */) === 0) {
        // connectedCallback
        const hostRef = getHostRef(elm);
        if (!(hostRef.$flags$ & 1 /* hasConnected */)) {
            // first time this component has connected
            hostRef.$flags$ |= 1 /* hasConnected */;
            let hostId;
            if ( !hostId) {
                // initUpdate
                // if the slot polyfill is required we'll need to put some nodes
                // in here to act as original content anchors as we move nodes around
                // host element has been connected to the DOM
                {
                    setContentReference(elm);
                }
            }
            {
                // find the first ancestor component (if there is one) and register
                // this component as one of the actively loading child components for its ancestor
                let ancestorComponent = elm;
                while ((ancestorComponent = (ancestorComponent.parentNode || ancestorComponent.host))) {
                    // climb up the ancestors looking for the first
                    // component that hasn't finished its lifecycle update yet
                    if (
                        (ancestorComponent['s-p'])) {
                        // we found this components first ancestor component
                        // keep a reference to this component's ancestor component
                        attachToAncestor(hostRef, (hostRef.$ancestorComponent$ = ancestorComponent));
                        break;
                    }
                }
            }
            {
                initializeComponent(elm, hostRef, cmpMeta);
            }
        }
    }
};
const setContentReference = (elm) => {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    const crName =  '';
    const contentRefElm = elm['s-cr'] = doc.createComment(crName);
    contentRefElm['s-cn'] = true;
    elm.insertBefore(contentRefElm, elm.firstChild);
};
const insertVdomAnnotations = (doc) => {
    if (doc != null) {
        const docData = {
            hostIds: 0,
            rootLevelIds: 0
        };
        const orgLocationNodes = [];
        parseVNodeAnnotations(doc, doc.body, docData, orgLocationNodes);
        orgLocationNodes.forEach(orgLocationNode => {
            if (orgLocationNode != null) {
                const nodeRef = orgLocationNode['s-nr'];
                let hostId = nodeRef['s-host-id'];
                let nodeId = nodeRef['s-node-id'];
                let childId = `${hostId}.${nodeId}`;
                if (hostId == null) {
                    hostId = 0;
                    docData.rootLevelIds++;
                    nodeId = docData.rootLevelIds;
                    childId = `${hostId}.${nodeId}`;
                    if (nodeRef.nodeType === 1 /* ElementNode */) {
                        nodeRef.setAttribute(HYDRATE_CHILD_ID, childId);
                    }
                    else if (nodeRef.nodeType === 3 /* TextNode */) {
                        if (hostId === 0) {
                            const textContent = nodeRef.nodeValue.trim();
                            if (textContent === '') {
                                // useless whitespace node at the document root
                                orgLocationNode.remove();
                                return;
                            }
                        }
                        const commentBeforeTextNode = doc.createComment(childId);
                        commentBeforeTextNode.nodeValue = `${TEXT_NODE_ID}.${childId}`;
                        nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
                    }
                }
                let orgLocationNodeId = `${ORG_LOCATION_ID}.${childId}`;
                const orgLocationParentNode = orgLocationNode.parentElement;
                if (orgLocationParentNode && orgLocationParentNode['s-sd']) {
                    // ending with a . means that the parent element
                    // of this node's original location is a shadow dom element
                    // and this node is apart of the root level light dom
                    orgLocationNodeId += `.`;
                }
                orgLocationNode.nodeValue = orgLocationNodeId;
            }
        });
    }
};
const parseVNodeAnnotations = (doc, node, docData, orgLocationNodes) => {
    if (node == null) {
        return;
    }
    if (node['s-nr'] != null) {
        orgLocationNodes.push(node);
    }
    if (node.nodeType === 1 /* ElementNode */) {
        node.childNodes.forEach(childNode => {
            const hostRef = getHostRef(childNode);
            if (hostRef != null) {
                const cmpData = {
                    nodeIds: 0
                };
                insertVNodeAnnotations(doc, childNode, hostRef.$vnode$, docData, cmpData);
            }
            parseVNodeAnnotations(doc, childNode, docData, orgLocationNodes);
        });
    }
};
const insertVNodeAnnotations = (doc, hostElm, vnode, docData, cmpData) => {
    if (vnode != null) {
        const hostId = ++docData.hostIds;
        hostElm.setAttribute(HYDRATE_ID, hostId);
        if (hostElm['s-cr'] != null) {
            hostElm['s-cr'].nodeValue = `${CONTENT_REF_ID}.${hostId}`;
        }
        if (vnode.$children$ != null) {
            const depth = 0;
            vnode.$children$.forEach((vnodeChild, index) => {
                insertChildVNodeAnnotations(doc, vnodeChild, cmpData, hostId, depth, index);
            });
        }
    }
};
const insertChildVNodeAnnotations = (doc, vnodeChild, cmpData, hostId, depth, index) => {
    const childElm = vnodeChild.$elm$;
    if (childElm == null) {
        return;
    }
    const nodeId = cmpData.nodeIds++;
    const childId = `${hostId}.${nodeId}.${depth}.${index}`;
    childElm['s-host-id'] = hostId;
    childElm['s-node-id'] = nodeId;
    if (childElm.nodeType === 1 /* ElementNode */) {
        childElm.setAttribute(HYDRATE_CHILD_ID, childId);
    }
    else if (childElm.nodeType === 3 /* TextNode */) {
        const parentNode = childElm.parentNode;
        if (parentNode.nodeName !== 'STYLE') {
            const textNodeId = `${TEXT_NODE_ID}.${childId}`;
            const commentBeforeTextNode = doc.createComment(textNodeId);
            parentNode.insertBefore(commentBeforeTextNode, childElm);
        }
    }
    else if (childElm.nodeType === 8 /* CommentNode */) {
        if (childElm['s-sr']) {
            const slotName = (childElm['s-sn'] || '');
            const slotNodeId = `${SLOT_NODE_ID}.${childId}.${slotName}`;
            childElm.nodeValue = slotNodeId;
        }
    }
    if (vnodeChild.$children$ != null) {
        const childDepth = depth + 1;
        vnodeChild.$children$.forEach((vnode, index) => {
            insertChildVNodeAnnotations(doc, vnode, cmpData, hostId, childDepth, index);
        });
    }
};

function proxyHostElement(elm, cmpMeta) {
    if (typeof elm.componentOnReady !== 'function') {
        elm.componentOnReady = componentOnReady;
    }
    if (typeof elm.forceUpdate !== 'function') {
        elm.forceUpdate = forceUpdate;
    }
    if (cmpMeta.$members$ != null) {
        const hostRef = getHostRef(elm);
        const members = Object.entries(cmpMeta.$members$);
        members.forEach(([memberName, m]) => {
            const memberFlags = m[0];
            if (memberFlags & 31) {
                const attributeName = (m[1] || memberName);
                const attrValue = elm.getAttribute(attributeName);
                if (attrValue != null) {
                    const parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
                    hostRef.$instanceValues$.set(memberName, parsedAttrValue);
                }
                const ownValue = elm[memberName];
                if (ownValue !== undefined) {
                    hostRef.$instanceValues$.set(memberName, ownValue);
                    delete elm[memberName];
                }
                Object.defineProperty(elm, memberName, {
                    get() {
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true
                });
            }
            else if (memberFlags & 64) {
                Object.defineProperty(elm, memberName, {
                    value() {
                        const ref = getHostRef(this);
                        const args = arguments;
                        return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName].apply(ref.$lazyInstance$, args)).catch(consoleError);
                    }
                });
            }
        });
    }
}
function componentOnReady() {
    return getHostRef(this).$onReadyPromise$;
}
function forceUpdate() { }

function hydrateComponent(win, results, tagName, elm, waitPromises) {
    const Cstr = getComponent(tagName);
    if (Cstr != null) {
        const cmpMeta = Cstr.cmpMeta;
        if (cmpMeta != null) {
            const hydratePromise = new Promise(async (resolve) => {
                try {
                    registerHost(elm);
                    proxyHostElement(elm, cmpMeta);
                    connectedCallback(elm, cmpMeta);
                    await elm.componentOnReady();
                    results.hydratedCount++;
                    const ref = getHostRef(elm);
                    const modeName = !ref.$modeName$ ? '$' : ref.$modeName$;
                    if (!results.hydratedComponents.some(c => c.tag === tagName && c.mode === modeName)) {
                        results.hydratedComponents.push({
                            tag: tagName,
                            mode: modeName
                        });
                    }
                }
                catch (e) {
                    win.console.error(e);
                }
                resolve();
            });
            waitPromises.push(hydratePromise);
        }
    }
}

function bootstrapHydrate(win, opts, done) {
    const results = {
        hydratedCount: 0,
        hydratedComponents: []
    };
    plt.$resourcesUrl$ = new URL(opts.resourcesUrl || './', doc.baseURI).href;
    try {
        const connectedElements = new Set();
        const waitPromises = [];
        const patchedConnectedCallback = function patchedConnectedCallback() {
            connectElements(win, opts, results, this, connectedElements, waitPromises);
        };
        const patchComponent = function (elm) {
            const tagName = elm.nodeName.toLowerCase();
            if (elm.tagName.includes('-')) {
                const Cstr = getComponent(tagName);
                if (Cstr != null) {
                    if (typeof elm.connectedCallback !== 'function') {
                        elm.connectedCallback = patchedConnectedCallback;
                    }
                    elm['s-p'] = [];
                    elm['s-rc'] = [];
                }
            }
        };
        let orgDocumentCreateElement = win.document.createElement;
        win.document.createElement = function patchedCreateElement(tagName) {
            const elm = orgDocumentCreateElement.call(win.document, tagName);
            patchComponent(elm);
            return elm;
        };
        const patchChild = (elm) => {
            if (elm != null && elm.nodeType === 1) {
                patchComponent(elm);
                const children = elm.children;
                for (let i = 0, ii = children.length; i < ii; i++) {
                    patchChild(children[i]);
                }
            }
        };
        patchChild(win.document.body);
        const initConnectElement = (elm) => {
            if (elm != null && elm.nodeType === 1) {
                if (typeof elm.connectedCallback === 'function') {
                    elm.connectedCallback();
                }
                const children = elm.children;
                for (let i = 0, ii = children.length; i < ii; i++) {
                    initConnectElement(children[i]);
                }
            }
        };
        initConnectElement(win.document.body);
        Promise.all(waitPromises)
            .then(() => {
            try {
                waitPromises.length = 0;
                connectedElements.clear();
                if (opts.clientHydrateAnnotations) {
                    insertVdomAnnotations(win.document);
                }
                win.document.createElement = orgDocumentCreateElement;
                win = opts = orgDocumentCreateElement = null;
            }
            catch (e) {
                win.console.error(e);
            }
            done(results);
        })
            .catch(e => {
            try {
                win.console.error(e);
                waitPromises.length = 0;
                connectedElements.clear();
                win.document.createElement = orgDocumentCreateElement;
                win = opts = orgDocumentCreateElement = null;
            }
            catch (e) { }
            done(results);
        });
    }
    catch (e) {
        win.console.error(e);
        win = opts = null;
        done(results);
    }
}
function connectElements(win, opts, results, elm, connectedElements, waitPromises) {
    if (elm != null && elm.nodeType === 1 && results.hydratedCount < opts.maxHydrateCount && shouldHydrate(elm)) {
        const tagName = elm.nodeName.toLowerCase();
        if (tagName.includes('-') && !connectedElements.has(elm)) {
            connectedElements.add(elm);
            hydrateComponent(win, results, tagName, elm, waitPromises);
        }
        const children = elm.children;
        if (children != null) {
            for (let i = 0, ii = children.length; i < ii; i++) {
                connectElements(win, opts, results, children[i], connectedElements, waitPromises);
            }
        }
    }
}
function shouldHydrate(elm) {
    if (elm.nodeType === 9) {
        return true;
    }
    if (NO_HYDRATE_TAGS.has(elm.nodeName)) {
        return false;
    }
    if (elm.hasAttribute('no-prerender')) {
        return false;
    }
    const parentNode = elm.parentNode;
    if (parentNode == null) {
        return true;
    }
    return shouldHydrate(parentNode);
}
const NO_HYDRATE_TAGS = new Set([
    'CODE',
    'HEAD',
    'IFRAME',
    'INPUT',
    'OBJECT',
    'OUTPUT',
    'NOSCRIPT',
    'PRE',
    'SCRIPT',
    'SELECT',
    'STYLE',
    'TEMPLATE',
    'TEXTAREA'
]);

const cstrs = new Map();
const loadModule = (cmpMeta, _hostRef, _hmrVersionId) => {
    return new Promise(resolve => {
        resolve(cstrs.get(cmpMeta.$tagName$));
    });
};
const getComponent = (tagName) => {
    return cstrs.get(tagName);
};
const isMemberInElement = (elm, memberName) => {
    if (elm != null) {
        if (memberName in elm) {
            return true;
        }
        const nodeName = elm.nodeName;
        if (nodeName) {
            const hostRef = getComponent(nodeName.toLowerCase());
            if (hostRef != null && hostRef.cmpMeta != null && hostRef.cmpMeta.$members$ != null) {
                return memberName in hostRef.cmpMeta.$members$;
            }
        }
    }
    return false;
};
const registerComponents = (Cstrs) => {
    Cstrs.forEach(Cstr => {
        cstrs.set(Cstr.cmpMeta.$tagName$, Cstr);
    });
};
const win = window;
const doc = win.document;
const writeTask = (cb) => {
    process.nextTick(() => {
        try {
            cb();
        }
        catch (e) {
            consoleError(e);
        }
    });
};
const nextTick = (cb) => Promise.resolve().then(cb);
const consoleError = (e) => {
    if (e != null) {
        console.error(e.stack || e.message || e);
    }
};
const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
};
const supportsShadowDom = false;
const hostRefs = new WeakMap();
const getHostRef = (ref) => hostRefs.get(ref);
const registerInstance = (lazyInstance, hostRef) => hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);
const registerHost = (elm) => {
    const hostRef = {
        $flags$: 0,
        $hostElement$: elm,
        $instanceValues$: new Map(),
    };
    hostRef.$onInstancePromise$ = new Promise(r => hostRef.$onInstanceResolve$ = r);
    hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
    elm['s-p'] = [];
    elm['s-rc'] = [];
    return hostRefs.set(elm, hostRef);
};
const styles = new Map();

const COLUMNS = {
    XS: 18,
    S: 18,
    M: 36,
    L: 36,
    XL: 36,
};

class GridCol {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Number of columns - As it's mobile first, that's the default size.
         */
        this.col = 0;
        /**
         *Number of columns - S
         */
        this.colS = 0;
        /**
         *Number of columns - M
         */
        this.colM = 0;
        /**
         *Number of columns - L
         */
        this.colL = 0;
        /**
         *Number of columns - XL
         */
        this.colXL = 0;
        /**
         * Offset
         */
        this.offset = 0;
        /**
         * Offset - S
         */
        this.offsetS = 0;
        /**
         * Offset - M
         */
        this.offsetM = 0;
        /**
         * Offset - L
         */
        this.offsetL = 0;
        /**
         * Offset - XL
         */
        this.offsetXL = 0;
        /**
         * Offset right
         */
        this.offsetRight = 0;
        /**
         * Offset right - S
         */
        this.offsetRightS = 0;
        /**
         * Offset right - M
         */
        this.offsetRightM = 0;
        /**
         * Offset right - L
         */
        this.offsetRightL = 0;
        /**
         * Offset right - XL
         */
        this.offsetRightXL = 0;
        /**
         * Is centered
         */
        this.isCentered = false;
        this.getColClassnames = () => {
            const col = this.col;
            const colS = this.colS ? this.colS : col;
            const colM = this.colM ? this.colM : colS;
            const colL = this.colL ? this.colL : colM;
            const colXL = this.colXL ? this.colXL : colL;
            const colClassname = col ? `col-xs-${col}` : '';
            const colSClassname = (colS && colS !== col) || (COLUMNS.S !== COLUMNS.XS)  ? `col-s-${colS}` : '';
            const colMClassname = (colM && colM !== colS) ||  colM > 0 ? `col-m-${colM}` : '';
            const colLClassname = (colL && colL !== colM) || (COLUMNS.L !== COLUMNS.M)  ? `col-l-${colL}` : '';
            const colXLClassname = (colXL && colXL !== colL) || (COLUMNS.XL !== COLUMNS.L)  ? `col-xl-${colXL}` : '';
            return `${colClassname} ${colSClassname} ${colMClassname} ${colLClassname} ${colXLClassname}`;
        };
        this.getOffsetClassnames = () => {
            // if no offset at all, no need for classes
            if (!this.offset && !this.offsetS && !this.offsetM && !this.offsetL && !this.offsetXL)
                return '';
            const offsetClassname = this.offset > 0 ? `col-offset-xs-${this.offset}` : '';
            const offsetSClassname = (this.offsetS !== this.offset) || (COLUMNS.S !== COLUMNS.XS) ? `col-offset-s-${this.offsetS}` : '';
            const offsetMClassname = (this.offsetM !== this.offsetS) || (COLUMNS.M !== COLUMNS.S) ? `col-offset-m-${this.offsetM}` : '';
            const offsetLClassname = (this.offsetL !== this.offsetM) || (COLUMNS.L !== COLUMNS.M) ? `col-offset-l-${this.offsetL}` : '';
            const offsetXLClassname = (this.offsetXL !== this.offsetL) || (COLUMNS.XL !== COLUMNS.L) ? `col-offset-xl-${this.offsetXL}` : '';
            return `${offsetClassname} ${offsetSClassname} ${offsetMClassname} ${offsetLClassname} ${offsetXLClassname}`;
        };
        this.getOffsetRightClassnames = () => {
            // if no offset Right at all, no need for classes
            if (!this.offsetRight && !this.offsetRightS && !this.offsetRightM && !this.offsetRightL && !this.offsetRightXL)
                return '';
            const offsetRightClassname = this.offsetRight > 0 ? `col-offset-right-xs-${this.offsetRight}` : '';
            const offsetRightSClassname = (this.offsetRightS !== this.offsetRight) || (COLUMNS.S !== COLUMNS.XS) ? `col-offset-right-s-${this.offsetRightS}` : '';
            const offsetRightMClassname = (this.offsetRightM !== this.offsetRightS) || (COLUMNS.M !== COLUMNS.S) ? `col-offset-right-m-${this.offsetRightM}` : '';
            const offsetRightLClassname = (this.offsetRightL !== this.offsetRightM) || (COLUMNS.L !== COLUMNS.M) ? `col-offset-right-l-${this.offsetRightL}` : '';
            const offsetRightXLClassname = (this.offsetRightXL !== this.offsetRightL) || (COLUMNS.XL !== COLUMNS.L) ? `col-offset-right-xl-${this.offsetRightXL}` : '';
            return `${offsetRightClassname} ${offsetRightSClassname} ${offsetRightMClassname} ${offsetRightLClassname} ${offsetRightXLClassname}`;
        };
    }
    render() {
        const isCentered = this.isCentered ? `grid-col-center` : '';
        return h(Host, { class: `grid-col 
              ${isCentered}
              ${this.getColClassnames()}
              ${this.getOffsetClassnames()}
              ${this.getOffsetRightClassnames()}
            ` }, h("slot", null));
    }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "grid-col",
        "$members$": {
            "col": [2],
            "colS": [2, "col-s"],
            "colM": [2, "col-m"],
            "colL": [2, "col-l"],
            "colXL": [2, "col-xl"],
            "offset": [2],
            "offsetS": [2, "offset-s"],
            "offsetM": [2, "offset-m"],
            "offsetL": [2, "offset-l"],
            "offsetXL": [2, "offset-xl"],
            "offsetRight": [2, "offset-right"],
            "offsetRightS": [2, "offset-right-s"],
            "offsetRightM": [2, "offset-right-m"],
            "offsetRightL": [2, "offset-right-l"],
            "offsetRightXL": [2, "offset-right-xl"],
            "isCentered": [4, "center"]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

class GridContainer {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return h(Host, { class: `grid-container` }, h("slot", null));
    }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "grid-container",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

class GridGhost {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.generateCols = () => {
            const cols = [...Array(COLUMNS.XL)];
            return cols.map(() => h("grid-col", { class: `item`, col: 1 }));
        };
    }
    render() {
        return h(Host, { class: `grid-ghost` }, h("grid-container", { class: "full-height" }, h("grid-row", { class: "full-height" }, this.generateCols())));
    }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "grid-ghost",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

// import styles from './grid-row.scss';
class GridRow {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         *Justify content
         */
        this.justifyContent = '';
        /**
         * Align Items
         */
        this.alignItems = '';
        /**
         * Is centered
         */
        this.isCentered = false;
        /**
         * Is centered on the x axis
         */
        this.isXCentered = false;
        /**
         * Is centered on the y axis
         */
        this.isYCentered = false;
        /**
         * Is reversed
         */
        this.isReversed = false;
    }
    validateJustifyContent(newValue) {
        const classnames = ['initial', 'start', 'end', 'flex-start', 'flex-end', 'baseline', 'left', 'right', 'center', 'safe', 'stretch', 'space-around', 'space-between', 'space-evenly', 'center-only-mobile'];
        const justifyContentIsValidate = classnames.indexOf(newValue) > -1;
        if (!justifyContentIsValidate && newValue.length) {
            console.info('justify-content: not a valid value');
        }
    }
    validateAlignItems(newValue) {
        const classnames = ['initial', 'start', 'end', 'flex-start', 'flex-end', 'baseline', 'left', 'right', 'center', 'safe', 'stretch', 'space-around', 'space-between', 'space-evenly'];
        const alignItemsIsValidate = classnames.indexOf(newValue) > -1;
        if (!alignItemsIsValidate && newValue.length) {
            console.info('align-items: not a valid value');
        }
    }
    render() {
        const justifyContent = this.justifyContent ? `jc-${this.justifyContent}` : '';
        const alignItems = this.alignItems ? `ai-${this.alignItems}` : '';
        const isCentered = this.isCentered ? `grid-row-center` : '';
        const isXCentered = this.isXCentered ? `x-center` : '';
        const isYCentered = this.isYCentered ? `y-center` : '';
        const isReversed = this.isReversed ? `grid-row-reverse` : '';
        return h(Host, { class: `grid-row 
              ${justifyContent}
              ${alignItems}
              ${isCentered}
              ${isXCentered}
              ${isYCentered}
              ${isReversed}
            ` }, h("slot", null));
    }
    static get watchers() { return {
        "justifyContent": ["validateJustifyContent"],
        "alignItems": ["validateAlignItems"]
    }; }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "grid-row",
        "$members$": {
            "justifyContent": [1, "justify-content"],
            "alignItems": [1, "align-items"],
            "isCentered": [4, "center"],
            "isXCentered": [4, "x-center"],
            "isYCentered": [4, "y-center"],
            "isReversed": [4, "reverse"]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

function format(first, middle, last) {
    return ((first || '') +
        (middle ? ` ${middle}` : '') +
        (last ? ` ${last}` : ''));
}

class MyComponent {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    getText() {
        return format(this.first, this.middle, this.last);
    }
    render() {
        return h("div", null, "Hello, World! I'm ", this.getText());
    }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "my-component",
        "$members$": {
            "first": [1],
            "middle": [1],
            "last": [1]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

class SimpleButton {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Show number of clicks
         */
        this.showNbOfClick = false;
        /**
         * theme
         */
        this.theme = 'primary';
        /**
         * Number of clicks
         */
        this.nbOfClicks = 0;
        this.handleClick = () => {
            this.nbOfClicks += 1;
        };
    }
    validateTheme(newValue) {
        const themes = ['primary', 'secondary'];
        const themeIsValidate = themes.indexOf(newValue) > -1;
        if (!themeIsValidate) {
            throw new Error('theme: not a valide theme');
        }
    }
    componentWillLoad() {
        this.validateTheme(this.theme);
    }
    render() {
        return h("button", { class: `simple-button ${this.theme}`, onClick: this.handleClick }, h("span", { class: "label" }, h("slot", null)), this.showNbOfClick && this.nbOfClicks > 0 && (h("span", { class: "nb-of-clicks" }, ` - ${this.nbOfClicks}`)));
    }
    static get watchers() { return {
        "theme": ["validateTheme"]
    }; }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "simple-button",
        "$members$": {
            "showNbOfClick": [4, "show-click"],
            "theme": [1],
            "nbOfClicks": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const cmps = [
  GridCol,
  GridContainer,
  GridGhost,
  GridRow,
  MyComponent,
  SimpleButton,
];
registerComponents(cmps);
styles.set('sc-grid-col',':global *{vertical-align:baseline;border:0 none;padding:0;margin:0;-webkit-box-sizing:border-box;box-sizing:border-box}:global a,:global abbr,:global acronym,:global address,:global applet,:global big,:global blockquote,:global body,:global button,:global caption,:global cite,:global code,:global dd,:global del,:global dfn,:global div,:global dl,:global dt,:global em,:global fieldset,:global font,:global form,:global h1,:global h2,:global h3,:global h4,:global h5,:global h6,:global html,:global iframe,:global img,:global ins,:global kbd,:global label,:global legend,:global li,:global object,:global ol,:global p,:global pre,:global q,:global s,:global samp,:global small,:global span,:global strike,:global strong,:global sub,:global sup,:global table,:global tbody,:global td,:global tfoot,:global th,:global thead,:global tr,:global tt,:global ul,:global var{font-family:inherit;color:inherit;font-size:inherit;line-height:inherit;letter-spacing:inherit;font-weight:inherit;font-style:inherit;vertical-align:inherit;border:0 none;padding:0;margin:0}:global img{width:100%;height:auto;display:block}:global figure{margin:0}:global button{border:none;border-radius:0;background-color:transparent;cursor:pointer}:global [role=button],:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{background:none;border:0;color:inherit;font:inherit;line-height:normal;overflow:visible;padding:0;-webkit-appearance:button;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}:global button::-moz-focus-inner,:global input::-moz-focus-inner{border:0;padding:0}:global strong{font-weight:700}:global li{list-style-type:none}:global a{text-decoration:none;cursor:pointer;line-height:normal}:focus{-webkit-transition-delay:0ms;transition-delay:0ms}:global a,:global em,:global span,:global strong{font-size:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;font-family:inherit}.grid-col{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-preferred-size:100%;flex-basis:100%;width:100%;max-width:100%}.col-xs-1{-ms-flex-preferred-size:5.5555555556%;flex-basis:5.5555555556%;width:5.5555555556%;max-width:5.5555555556%}.col-xs-2{-ms-flex-preferred-size:11.1111111111%;flex-basis:11.1111111111%;width:11.1111111111%;max-width:11.1111111111%}.col-xs-3{-ms-flex-preferred-size:16.6666666667%;flex-basis:16.6666666667%;width:16.6666666667%;max-width:16.6666666667%}.col-xs-4{-ms-flex-preferred-size:22.2222222222%;flex-basis:22.2222222222%;width:22.2222222222%;max-width:22.2222222222%}.col-xs-5{-ms-flex-preferred-size:27.7777777778%;flex-basis:27.7777777778%;width:27.7777777778%;max-width:27.7777777778%}.col-xs-6{-ms-flex-preferred-size:33.3333333333%;flex-basis:33.3333333333%;width:33.3333333333%;max-width:33.3333333333%}.col-xs-7{-ms-flex-preferred-size:38.8888888889%;flex-basis:38.8888888889%;width:38.8888888889%;max-width:38.8888888889%}.col-xs-8{-ms-flex-preferred-size:44.4444444444%;flex-basis:44.4444444444%;width:44.4444444444%;max-width:44.4444444444%}.col-xs-9{-ms-flex-preferred-size:50%;flex-basis:50%;width:50%;max-width:50%}.col-xs-10{-ms-flex-preferred-size:55.5555555556%;flex-basis:55.5555555556%;width:55.5555555556%;max-width:55.5555555556%}.col-xs-11{-ms-flex-preferred-size:61.1111111111%;flex-basis:61.1111111111%;width:61.1111111111%;max-width:61.1111111111%}.col-xs-12{-ms-flex-preferred-size:66.6666666667%;flex-basis:66.6666666667%;width:66.6666666667%;max-width:66.6666666667%}.col-xs-13{-ms-flex-preferred-size:72.2222222222%;flex-basis:72.2222222222%;width:72.2222222222%;max-width:72.2222222222%}.col-xs-14{-ms-flex-preferred-size:77.7777777778%;flex-basis:77.7777777778%;width:77.7777777778%;max-width:77.7777777778%}.col-xs-15{-ms-flex-preferred-size:83.3333333333%;flex-basis:83.3333333333%;width:83.3333333333%;max-width:83.3333333333%}.col-xs-16{-ms-flex-preferred-size:88.8888888889%;flex-basis:88.8888888889%;width:88.8888888889%;max-width:88.8888888889%}.col-xs-17{-ms-flex-preferred-size:94.4444444444%;flex-basis:94.4444444444%;width:94.4444444444%;max-width:94.4444444444%}.col-xs-18{-ms-flex-preferred-size:100%;flex-basis:100%;width:100%;max-width:100%}.col-offset-xs-0{margin-left:0}.col-offset-xs-1{margin-left:5.5555555556%}.col-offset-xs-2{margin-left:11.1111111111%}.col-offset-xs-3{margin-left:16.6666666667%}.col-offset-xs-4{margin-left:22.2222222222%}.col-offset-xs-5{margin-left:27.7777777778%}.col-offset-xs-6{margin-left:33.3333333333%}.col-offset-xs-7{margin-left:38.8888888889%}.col-offset-xs-8{margin-left:44.4444444444%}.col-offset-xs-9{margin-left:50%}.col-offset-xs-10{margin-left:55.5555555556%}.col-offset-xs-11{margin-left:61.1111111111%}.col-offset-xs-12{margin-left:66.6666666667%}.col-offset-xs-13{margin-left:72.2222222222%}.col-offset-xs-14{margin-left:77.7777777778%}.col-offset-xs-15{margin-left:83.3333333333%}.col-offset-xs-16{margin-left:88.8888888889%}.col-offset-xs-17{margin-left:94.4444444444%}.col-offset-xs-18{margin-left:100%}.col-offset-right-XS-1{margin-right:5.5555555556%}.col-offset-right-XS-2{margin-right:11.1111111111%}.col-offset-right-XS-3{margin-right:16.6666666667%}.col-offset-right-XS-4{margin-right:22.2222222222%}.col-offset-right-XS-5{margin-right:27.7777777778%}.col-offset-right-XS-6{margin-right:33.3333333333%}.col-offset-right-XS-7{margin-right:38.8888888889%}.col-offset-right-XS-8{margin-right:44.4444444444%}.col-offset-right-XS-9{margin-right:50%}\@media (min-width:420px){.col-s-1{-ms-flex-preferred-size:5.5555555556%;flex-basis:5.5555555556%;width:5.5555555556%;max-width:5.5555555556%}}\@media (min-width:420px){.col-s-2{-ms-flex-preferred-size:11.1111111111%;flex-basis:11.1111111111%;width:11.1111111111%;max-width:11.1111111111%}}\@media (min-width:420px){.col-s-3{-ms-flex-preferred-size:16.6666666667%;flex-basis:16.6666666667%;width:16.6666666667%;max-width:16.6666666667%}}\@media (min-width:420px){.col-s-4{-ms-flex-preferred-size:22.2222222222%;flex-basis:22.2222222222%;width:22.2222222222%;max-width:22.2222222222%}}\@media (min-width:420px){.col-s-5{-ms-flex-preferred-size:27.7777777778%;flex-basis:27.7777777778%;width:27.7777777778%;max-width:27.7777777778%}}\@media (min-width:420px){.col-s-6{-ms-flex-preferred-size:33.3333333333%;flex-basis:33.3333333333%;width:33.3333333333%;max-width:33.3333333333%}}\@media (min-width:420px){.col-s-7{-ms-flex-preferred-size:38.8888888889%;flex-basis:38.8888888889%;width:38.8888888889%;max-width:38.8888888889%}}\@media (min-width:420px){.col-s-8{-ms-flex-preferred-size:44.4444444444%;flex-basis:44.4444444444%;width:44.4444444444%;max-width:44.4444444444%}}\@media (min-width:420px){.col-s-9{-ms-flex-preferred-size:50%;flex-basis:50%;width:50%;max-width:50%}}\@media (min-width:420px){.col-s-10{-ms-flex-preferred-size:55.5555555556%;flex-basis:55.5555555556%;width:55.5555555556%;max-width:55.5555555556%}}\@media (min-width:420px){.col-s-11{-ms-flex-preferred-size:61.1111111111%;flex-basis:61.1111111111%;width:61.1111111111%;max-width:61.1111111111%}}\@media (min-width:420px){.col-s-12{-ms-flex-preferred-size:66.6666666667%;flex-basis:66.6666666667%;width:66.6666666667%;max-width:66.6666666667%}}\@media (min-width:420px){.col-s-13{-ms-flex-preferred-size:72.2222222222%;flex-basis:72.2222222222%;width:72.2222222222%;max-width:72.2222222222%}}\@media (min-width:420px){.col-s-14{-ms-flex-preferred-size:77.7777777778%;flex-basis:77.7777777778%;width:77.7777777778%;max-width:77.7777777778%}}\@media (min-width:420px){.col-s-15{-ms-flex-preferred-size:83.3333333333%;flex-basis:83.3333333333%;width:83.3333333333%;max-width:83.3333333333%}}\@media (min-width:420px){.col-s-16{-ms-flex-preferred-size:88.8888888889%;flex-basis:88.8888888889%;width:88.8888888889%;max-width:88.8888888889%}}\@media (min-width:420px){.col-s-17{-ms-flex-preferred-size:94.4444444444%;flex-basis:94.4444444444%;width:94.4444444444%;max-width:94.4444444444%}}\@media (min-width:420px){.col-s-18{-ms-flex-preferred-size:100%;flex-basis:100%;width:100%;max-width:100%}}\@media (min-width:420px){.col-offset-s-0{margin-left:0}}\@media (min-width:420px){.col-offset-s-1{margin-left:5.5555555556%}}\@media (min-width:420px){.col-offset-s-2{margin-left:11.1111111111%}}\@media (min-width:420px){.col-offset-s-3{margin-left:16.6666666667%}}\@media (min-width:420px){.col-offset-s-4{margin-left:22.2222222222%}}\@media (min-width:420px){.col-offset-s-5{margin-left:27.7777777778%}}\@media (min-width:420px){.col-offset-s-6{margin-left:33.3333333333%}}\@media (min-width:420px){.col-offset-s-7{margin-left:38.8888888889%}}\@media (min-width:420px){.col-offset-s-8{margin-left:44.4444444444%}}\@media (min-width:420px){.col-offset-s-9{margin-left:50%}}\@media (min-width:420px){.col-offset-s-10{margin-left:55.5555555556%}}\@media (min-width:420px){.col-offset-s-11{margin-left:61.1111111111%}}\@media (min-width:420px){.col-offset-s-12{margin-left:66.6666666667%}}\@media (min-width:420px){.col-offset-s-13{margin-left:72.2222222222%}}\@media (min-width:420px){.col-offset-s-14{margin-left:77.7777777778%}}\@media (min-width:420px){.col-offset-s-15{margin-left:83.3333333333%}}\@media (min-width:420px){.col-offset-s-16{margin-left:88.8888888889%}}\@media (min-width:420px){.col-offset-s-17{margin-left:94.4444444444%}}\@media (min-width:420px){.col-offset-s-18{margin-left:100%}}\@media (min-width:420px){.col-offset-right-S-1{margin-right:5.5555555556%}}\@media (min-width:420px){.col-offset-right-S-2{margin-right:11.1111111111%}}\@media (min-width:420px){.col-offset-right-S-3{margin-right:16.6666666667%}}\@media (min-width:420px){.col-offset-right-S-4{margin-right:22.2222222222%}}\@media (min-width:420px){.col-offset-right-S-5{margin-right:27.7777777778%}}\@media (min-width:420px){.col-offset-right-S-6{margin-right:33.3333333333%}}\@media (min-width:420px){.col-offset-right-S-7{margin-right:38.8888888889%}}\@media (min-width:420px){.col-offset-right-S-8{margin-right:44.4444444444%}}\@media (min-width:420px){.col-offset-right-S-9{margin-right:50%}}\@media (min-width:768px){.col-m-1{-ms-flex-preferred-size:2.7777777778%;flex-basis:2.7777777778%;width:2.7777777778%;max-width:2.7777777778%}}\@media (min-width:768px){.col-m-2{-ms-flex-preferred-size:5.5555555556%;flex-basis:5.5555555556%;width:5.5555555556%;max-width:5.5555555556%}}\@media (min-width:768px){.col-m-3{-ms-flex-preferred-size:8.3333333333%;flex-basis:8.3333333333%;width:8.3333333333%;max-width:8.3333333333%}}\@media (min-width:768px){.col-m-4{-ms-flex-preferred-size:11.1111111111%;flex-basis:11.1111111111%;width:11.1111111111%;max-width:11.1111111111%}}\@media (min-width:768px){.col-m-5{-ms-flex-preferred-size:13.8888888889%;flex-basis:13.8888888889%;width:13.8888888889%;max-width:13.8888888889%}}\@media (min-width:768px){.col-m-6{-ms-flex-preferred-size:16.6666666667%;flex-basis:16.6666666667%;width:16.6666666667%;max-width:16.6666666667%}}\@media (min-width:768px){.col-m-7{-ms-flex-preferred-size:19.4444444444%;flex-basis:19.4444444444%;width:19.4444444444%;max-width:19.4444444444%}}\@media (min-width:768px){.col-m-8{-ms-flex-preferred-size:22.2222222222%;flex-basis:22.2222222222%;width:22.2222222222%;max-width:22.2222222222%}}\@media (min-width:768px){.col-m-9{-ms-flex-preferred-size:25%;flex-basis:25%;width:25%;max-width:25%}}\@media (min-width:768px){.col-m-10{-ms-flex-preferred-size:27.7777777778%;flex-basis:27.7777777778%;width:27.7777777778%;max-width:27.7777777778%}}\@media (min-width:768px){.col-m-11{-ms-flex-preferred-size:30.5555555556%;flex-basis:30.5555555556%;width:30.5555555556%;max-width:30.5555555556%}}\@media (min-width:768px){.col-m-12{-ms-flex-preferred-size:33.3333333333%;flex-basis:33.3333333333%;width:33.3333333333%;max-width:33.3333333333%}}\@media (min-width:768px){.col-m-13{-ms-flex-preferred-size:36.1111111111%;flex-basis:36.1111111111%;width:36.1111111111%;max-width:36.1111111111%}}\@media (min-width:768px){.col-m-14{-ms-flex-preferred-size:38.8888888889%;flex-basis:38.8888888889%;width:38.8888888889%;max-width:38.8888888889%}}\@media (min-width:768px){.col-m-15{-ms-flex-preferred-size:41.6666666667%;flex-basis:41.6666666667%;width:41.6666666667%;max-width:41.6666666667%}}\@media (min-width:768px){.col-m-16{-ms-flex-preferred-size:44.4444444444%;flex-basis:44.4444444444%;width:44.4444444444%;max-width:44.4444444444%}}\@media (min-width:768px){.col-m-17{-ms-flex-preferred-size:47.2222222222%;flex-basis:47.2222222222%;width:47.2222222222%;max-width:47.2222222222%}}\@media (min-width:768px){.col-m-18{-ms-flex-preferred-size:50%;flex-basis:50%;width:50%;max-width:50%}}\@media (min-width:768px){.col-m-19{-ms-flex-preferred-size:52.7777777778%;flex-basis:52.7777777778%;width:52.7777777778%;max-width:52.7777777778%}}\@media (min-width:768px){.col-m-20{-ms-flex-preferred-size:55.5555555556%;flex-basis:55.5555555556%;width:55.5555555556%;max-width:55.5555555556%}}\@media (min-width:768px){.col-m-21{-ms-flex-preferred-size:58.3333333333%;flex-basis:58.3333333333%;width:58.3333333333%;max-width:58.3333333333%}}\@media (min-width:768px){.col-m-22{-ms-flex-preferred-size:61.1111111111%;flex-basis:61.1111111111%;width:61.1111111111%;max-width:61.1111111111%}}\@media (min-width:768px){.col-m-23{-ms-flex-preferred-size:63.8888888889%;flex-basis:63.8888888889%;width:63.8888888889%;max-width:63.8888888889%}}\@media (min-width:768px){.col-m-24{-ms-flex-preferred-size:66.6666666667%;flex-basis:66.6666666667%;width:66.6666666667%;max-width:66.6666666667%}}\@media (min-width:768px){.col-m-25{-ms-flex-preferred-size:69.4444444444%;flex-basis:69.4444444444%;width:69.4444444444%;max-width:69.4444444444%}}\@media (min-width:768px){.col-m-26{-ms-flex-preferred-size:72.2222222222%;flex-basis:72.2222222222%;width:72.2222222222%;max-width:72.2222222222%}}\@media (min-width:768px){.col-m-27{-ms-flex-preferred-size:75%;flex-basis:75%;width:75%;max-width:75%}}\@media (min-width:768px){.col-m-28{-ms-flex-preferred-size:77.7777777778%;flex-basis:77.7777777778%;width:77.7777777778%;max-width:77.7777777778%}}\@media (min-width:768px){.col-m-29{-ms-flex-preferred-size:80.5555555556%;flex-basis:80.5555555556%;width:80.5555555556%;max-width:80.5555555556%}}\@media (min-width:768px){.col-m-30{-ms-flex-preferred-size:83.3333333333%;flex-basis:83.3333333333%;width:83.3333333333%;max-width:83.3333333333%}}\@media (min-width:768px){.col-m-31{-ms-flex-preferred-size:86.1111111111%;flex-basis:86.1111111111%;width:86.1111111111%;max-width:86.1111111111%}}\@media (min-width:768px){.col-m-32{-ms-flex-preferred-size:88.8888888889%;flex-basis:88.8888888889%;width:88.8888888889%;max-width:88.8888888889%}}\@media (min-width:768px){.col-m-33{-ms-flex-preferred-size:91.6666666667%;flex-basis:91.6666666667%;width:91.6666666667%;max-width:91.6666666667%}}\@media (min-width:768px){.col-m-34{-ms-flex-preferred-size:94.4444444444%;flex-basis:94.4444444444%;width:94.4444444444%;max-width:94.4444444444%}}\@media (min-width:768px){.col-m-35{-ms-flex-preferred-size:97.2222222222%;flex-basis:97.2222222222%;width:97.2222222222%;max-width:97.2222222222%}}\@media (min-width:768px){.col-m-36{-ms-flex-preferred-size:100%;flex-basis:100%;width:100%;max-width:100%}}\@media (min-width:768px){.col-offset-m-0{margin-left:0}}\@media (min-width:768px){.col-offset-m-1{margin-left:2.7777777778%}}\@media (min-width:768px){.col-offset-m-2{margin-left:5.5555555556%}}\@media (min-width:768px){.col-offset-m-3{margin-left:8.3333333333%}}\@media (min-width:768px){.col-offset-m-4{margin-left:11.1111111111%}}\@media (min-width:768px){.col-offset-m-5{margin-left:13.8888888889%}}\@media (min-width:768px){.col-offset-m-6{margin-left:16.6666666667%}}\@media (min-width:768px){.col-offset-m-7{margin-left:19.4444444444%}}\@media (min-width:768px){.col-offset-m-8{margin-left:22.2222222222%}}\@media (min-width:768px){.col-offset-m-9{margin-left:25%}}\@media (min-width:768px){.col-offset-m-10{margin-left:27.7777777778%}}\@media (min-width:768px){.col-offset-m-11{margin-left:30.5555555556%}}\@media (min-width:768px){.col-offset-m-12{margin-left:33.3333333333%}}\@media (min-width:768px){.col-offset-m-13{margin-left:36.1111111111%}}\@media (min-width:768px){.col-offset-m-14{margin-left:38.8888888889%}}\@media (min-width:768px){.col-offset-m-15{margin-left:41.6666666667%}}\@media (min-width:768px){.col-offset-m-16{margin-left:44.4444444444%}}\@media (min-width:768px){.col-offset-m-17{margin-left:47.2222222222%}}\@media (min-width:768px){.col-offset-m-18{margin-left:50%}}\@media (min-width:768px){.col-offset-m-19{margin-left:52.7777777778%}}\@media (min-width:768px){.col-offset-m-20{margin-left:55.5555555556%}}\@media (min-width:768px){.col-offset-m-21{margin-left:58.3333333333%}}\@media (min-width:768px){.col-offset-m-22{margin-left:61.1111111111%}}\@media (min-width:768px){.col-offset-m-23{margin-left:63.8888888889%}}\@media (min-width:768px){.col-offset-m-24{margin-left:66.6666666667%}}\@media (min-width:768px){.col-offset-m-25{margin-left:69.4444444444%}}\@media (min-width:768px){.col-offset-m-26{margin-left:72.2222222222%}}\@media (min-width:768px){.col-offset-m-27{margin-left:75%}}\@media (min-width:768px){.col-offset-m-28{margin-left:77.7777777778%}}\@media (min-width:768px){.col-offset-m-29{margin-left:80.5555555556%}}\@media (min-width:768px){.col-offset-m-30{margin-left:83.3333333333%}}\@media (min-width:768px){.col-offset-m-31{margin-left:86.1111111111%}}\@media (min-width:768px){.col-offset-m-32{margin-left:88.8888888889%}}\@media (min-width:768px){.col-offset-m-33{margin-left:91.6666666667%}}\@media (min-width:768px){.col-offset-m-34{margin-left:94.4444444444%}}\@media (min-width:768px){.col-offset-m-35{margin-left:97.2222222222%}}\@media (min-width:768px){.col-offset-m-36{margin-left:100%}}\@media (min-width:768px){.col-offset-right-M-1{margin-right:2.7777777778%}}\@media (min-width:768px){.col-offset-right-M-2{margin-right:5.5555555556%}}\@media (min-width:768px){.col-offset-right-M-3{margin-right:8.3333333333%}}\@media (min-width:768px){.col-offset-right-M-4{margin-right:11.1111111111%}}\@media (min-width:768px){.col-offset-right-M-5{margin-right:13.8888888889%}}\@media (min-width:768px){.col-offset-right-M-6{margin-right:16.6666666667%}}\@media (min-width:768px){.col-offset-right-M-7{margin-right:19.4444444444%}}\@media (min-width:768px){.col-offset-right-M-8{margin-right:22.2222222222%}}\@media (min-width:768px){.col-offset-right-M-9{margin-right:25%}}\@media (min-width:768px){.col-offset-right-M-10{margin-right:27.7777777778%}}\@media (min-width:768px){.col-offset-right-M-11{margin-right:30.5555555556%}}\@media (min-width:768px){.col-offset-right-M-12{margin-right:33.3333333333%}}\@media (min-width:768px){.col-offset-right-M-13{margin-right:36.1111111111%}}\@media (min-width:768px){.col-offset-right-M-14{margin-right:38.8888888889%}}\@media (min-width:768px){.col-offset-right-M-15{margin-right:41.6666666667%}}\@media (min-width:768px){.col-offset-right-M-16{margin-right:44.4444444444%}}\@media (min-width:768px){.col-offset-right-M-17{margin-right:47.2222222222%}}\@media (min-width:768px){.col-offset-right-M-18{margin-right:50%}}\@media (min-width:1024px){.col-l-1{-ms-flex-preferred-size:2.7777777778%;flex-basis:2.7777777778%;width:2.7777777778%;max-width:2.7777777778%}}\@media (min-width:1024px){.col-l-2{-ms-flex-preferred-size:5.5555555556%;flex-basis:5.5555555556%;width:5.5555555556%;max-width:5.5555555556%}}\@media (min-width:1024px){.col-l-3{-ms-flex-preferred-size:8.3333333333%;flex-basis:8.3333333333%;width:8.3333333333%;max-width:8.3333333333%}}\@media (min-width:1024px){.col-l-4{-ms-flex-preferred-size:11.1111111111%;flex-basis:11.1111111111%;width:11.1111111111%;max-width:11.1111111111%}}\@media (min-width:1024px){.col-l-5{-ms-flex-preferred-size:13.8888888889%;flex-basis:13.8888888889%;width:13.8888888889%;max-width:13.8888888889%}}\@media (min-width:1024px){.col-l-6{-ms-flex-preferred-size:16.6666666667%;flex-basis:16.6666666667%;width:16.6666666667%;max-width:16.6666666667%}}\@media (min-width:1024px){.col-l-7{-ms-flex-preferred-size:19.4444444444%;flex-basis:19.4444444444%;width:19.4444444444%;max-width:19.4444444444%}}\@media (min-width:1024px){.col-l-8{-ms-flex-preferred-size:22.2222222222%;flex-basis:22.2222222222%;width:22.2222222222%;max-width:22.2222222222%}}\@media (min-width:1024px){.col-l-9{-ms-flex-preferred-size:25%;flex-basis:25%;width:25%;max-width:25%}}\@media (min-width:1024px){.col-l-10{-ms-flex-preferred-size:27.7777777778%;flex-basis:27.7777777778%;width:27.7777777778%;max-width:27.7777777778%}}\@media (min-width:1024px){.col-l-11{-ms-flex-preferred-size:30.5555555556%;flex-basis:30.5555555556%;width:30.5555555556%;max-width:30.5555555556%}}\@media (min-width:1024px){.col-l-12{-ms-flex-preferred-size:33.3333333333%;flex-basis:33.3333333333%;width:33.3333333333%;max-width:33.3333333333%}}\@media (min-width:1024px){.col-l-13{-ms-flex-preferred-size:36.1111111111%;flex-basis:36.1111111111%;width:36.1111111111%;max-width:36.1111111111%}}\@media (min-width:1024px){.col-l-14{-ms-flex-preferred-size:38.8888888889%;flex-basis:38.8888888889%;width:38.8888888889%;max-width:38.8888888889%}}\@media (min-width:1024px){.col-l-15{-ms-flex-preferred-size:41.6666666667%;flex-basis:41.6666666667%;width:41.6666666667%;max-width:41.6666666667%}}\@media (min-width:1024px){.col-l-16{-ms-flex-preferred-size:44.4444444444%;flex-basis:44.4444444444%;width:44.4444444444%;max-width:44.4444444444%}}\@media (min-width:1024px){.col-l-17{-ms-flex-preferred-size:47.2222222222%;flex-basis:47.2222222222%;width:47.2222222222%;max-width:47.2222222222%}}\@media (min-width:1024px){.col-l-18{-ms-flex-preferred-size:50%;flex-basis:50%;width:50%;max-width:50%}}\@media (min-width:1024px){.col-l-19{-ms-flex-preferred-size:52.7777777778%;flex-basis:52.7777777778%;width:52.7777777778%;max-width:52.7777777778%}}\@media (min-width:1024px){.col-l-20{-ms-flex-preferred-size:55.5555555556%;flex-basis:55.5555555556%;width:55.5555555556%;max-width:55.5555555556%}}\@media (min-width:1024px){.col-l-21{-ms-flex-preferred-size:58.3333333333%;flex-basis:58.3333333333%;width:58.3333333333%;max-width:58.3333333333%}}\@media (min-width:1024px){.col-l-22{-ms-flex-preferred-size:61.1111111111%;flex-basis:61.1111111111%;width:61.1111111111%;max-width:61.1111111111%}}\@media (min-width:1024px){.col-l-23{-ms-flex-preferred-size:63.8888888889%;flex-basis:63.8888888889%;width:63.8888888889%;max-width:63.8888888889%}}\@media (min-width:1024px){.col-l-24{-ms-flex-preferred-size:66.6666666667%;flex-basis:66.6666666667%;width:66.6666666667%;max-width:66.6666666667%}}\@media (min-width:1024px){.col-l-25{-ms-flex-preferred-size:69.4444444444%;flex-basis:69.4444444444%;width:69.4444444444%;max-width:69.4444444444%}}\@media (min-width:1024px){.col-l-26{-ms-flex-preferred-size:72.2222222222%;flex-basis:72.2222222222%;width:72.2222222222%;max-width:72.2222222222%}}\@media (min-width:1024px){.col-l-27{-ms-flex-preferred-size:75%;flex-basis:75%;width:75%;max-width:75%}}\@media (min-width:1024px){.col-l-28{-ms-flex-preferred-size:77.7777777778%;flex-basis:77.7777777778%;width:77.7777777778%;max-width:77.7777777778%}}\@media (min-width:1024px){.col-l-29{-ms-flex-preferred-size:80.5555555556%;flex-basis:80.5555555556%;width:80.5555555556%;max-width:80.5555555556%}}\@media (min-width:1024px){.col-l-30{-ms-flex-preferred-size:83.3333333333%;flex-basis:83.3333333333%;width:83.3333333333%;max-width:83.3333333333%}}\@media (min-width:1024px){.col-l-31{-ms-flex-preferred-size:86.1111111111%;flex-basis:86.1111111111%;width:86.1111111111%;max-width:86.1111111111%}}\@media (min-width:1024px){.col-l-32{-ms-flex-preferred-size:88.8888888889%;flex-basis:88.8888888889%;width:88.8888888889%;max-width:88.8888888889%}}\@media (min-width:1024px){.col-l-33{-ms-flex-preferred-size:91.6666666667%;flex-basis:91.6666666667%;width:91.6666666667%;max-width:91.6666666667%}}\@media (min-width:1024px){.col-l-34{-ms-flex-preferred-size:94.4444444444%;flex-basis:94.4444444444%;width:94.4444444444%;max-width:94.4444444444%}}\@media (min-width:1024px){.col-l-35{-ms-flex-preferred-size:97.2222222222%;flex-basis:97.2222222222%;width:97.2222222222%;max-width:97.2222222222%}}\@media (min-width:1024px){.col-l-36{-ms-flex-preferred-size:100%;flex-basis:100%;width:100%;max-width:100%}}\@media (min-width:1024px){.col-offset-l-0{margin-left:0}}\@media (min-width:1024px){.col-offset-l-1{margin-left:2.7777777778%}}\@media (min-width:1024px){.col-offset-l-2{margin-left:5.5555555556%}}\@media (min-width:1024px){.col-offset-l-3{margin-left:8.3333333333%}}\@media (min-width:1024px){.col-offset-l-4{margin-left:11.1111111111%}}\@media (min-width:1024px){.col-offset-l-5{margin-left:13.8888888889%}}\@media (min-width:1024px){.col-offset-l-6{margin-left:16.6666666667%}}\@media (min-width:1024px){.col-offset-l-7{margin-left:19.4444444444%}}\@media (min-width:1024px){.col-offset-l-8{margin-left:22.2222222222%}}\@media (min-width:1024px){.col-offset-l-9{margin-left:25%}}\@media (min-width:1024px){.col-offset-l-10{margin-left:27.7777777778%}}\@media (min-width:1024px){.col-offset-l-11{margin-left:30.5555555556%}}\@media (min-width:1024px){.col-offset-l-12{margin-left:33.3333333333%}}\@media (min-width:1024px){.col-offset-l-13{margin-left:36.1111111111%}}\@media (min-width:1024px){.col-offset-l-14{margin-left:38.8888888889%}}\@media (min-width:1024px){.col-offset-l-15{margin-left:41.6666666667%}}\@media (min-width:1024px){.col-offset-l-16{margin-left:44.4444444444%}}\@media (min-width:1024px){.col-offset-l-17{margin-left:47.2222222222%}}\@media (min-width:1024px){.col-offset-l-18{margin-left:50%}}\@media (min-width:1024px){.col-offset-l-19{margin-left:52.7777777778%}}\@media (min-width:1024px){.col-offset-l-20{margin-left:55.5555555556%}}\@media (min-width:1024px){.col-offset-l-21{margin-left:58.3333333333%}}\@media (min-width:1024px){.col-offset-l-22{margin-left:61.1111111111%}}\@media (min-width:1024px){.col-offset-l-23{margin-left:63.8888888889%}}\@media (min-width:1024px){.col-offset-l-24{margin-left:66.6666666667%}}\@media (min-width:1024px){.col-offset-l-25{margin-left:69.4444444444%}}\@media (min-width:1024px){.col-offset-l-26{margin-left:72.2222222222%}}\@media (min-width:1024px){.col-offset-l-27{margin-left:75%}}\@media (min-width:1024px){.col-offset-l-28{margin-left:77.7777777778%}}\@media (min-width:1024px){.col-offset-l-29{margin-left:80.5555555556%}}\@media (min-width:1024px){.col-offset-l-30{margin-left:83.3333333333%}}\@media (min-width:1024px){.col-offset-l-31{margin-left:86.1111111111%}}\@media (min-width:1024px){.col-offset-l-32{margin-left:88.8888888889%}}\@media (min-width:1024px){.col-offset-l-33{margin-left:91.6666666667%}}\@media (min-width:1024px){.col-offset-l-34{margin-left:94.4444444444%}}\@media (min-width:1024px){.col-offset-l-35{margin-left:97.2222222222%}}\@media (min-width:1024px){.col-offset-l-36{margin-left:100%}}\@media (min-width:1024px){.col-offset-right-L-1{margin-right:2.7777777778%}}\@media (min-width:1024px){.col-offset-right-L-2{margin-right:5.5555555556%}}\@media (min-width:1024px){.col-offset-right-L-3{margin-right:8.3333333333%}}\@media (min-width:1024px){.col-offset-right-L-4{margin-right:11.1111111111%}}\@media (min-width:1024px){.col-offset-right-L-5{margin-right:13.8888888889%}}\@media (min-width:1024px){.col-offset-right-L-6{margin-right:16.6666666667%}}\@media (min-width:1024px){.col-offset-right-L-7{margin-right:19.4444444444%}}\@media (min-width:1024px){.col-offset-right-L-8{margin-right:22.2222222222%}}\@media (min-width:1024px){.col-offset-right-L-9{margin-right:25%}}\@media (min-width:1024px){.col-offset-right-L-10{margin-right:27.7777777778%}}\@media (min-width:1024px){.col-offset-right-L-11{margin-right:30.5555555556%}}\@media (min-width:1024px){.col-offset-right-L-12{margin-right:33.3333333333%}}\@media (min-width:1024px){.col-offset-right-L-13{margin-right:36.1111111111%}}\@media (min-width:1024px){.col-offset-right-L-14{margin-right:38.8888888889%}}\@media (min-width:1024px){.col-offset-right-L-15{margin-right:41.6666666667%}}\@media (min-width:1024px){.col-offset-right-L-16{margin-right:44.4444444444%}}\@media (min-width:1024px){.col-offset-right-L-17{margin-right:47.2222222222%}}\@media (min-width:1024px){.col-offset-right-L-18{margin-right:50%}}\@media (min-width:1440px){.col-xl-1{-ms-flex-preferred-size:2.7777777778%;flex-basis:2.7777777778%;width:2.7777777778%;max-width:2.7777777778%}}\@media (min-width:1440px){.col-xl-2{-ms-flex-preferred-size:5.5555555556%;flex-basis:5.5555555556%;width:5.5555555556%;max-width:5.5555555556%}}\@media (min-width:1440px){.col-xl-3{-ms-flex-preferred-size:8.3333333333%;flex-basis:8.3333333333%;width:8.3333333333%;max-width:8.3333333333%}}\@media (min-width:1440px){.col-xl-4{-ms-flex-preferred-size:11.1111111111%;flex-basis:11.1111111111%;width:11.1111111111%;max-width:11.1111111111%}}\@media (min-width:1440px){.col-xl-5{-ms-flex-preferred-size:13.8888888889%;flex-basis:13.8888888889%;width:13.8888888889%;max-width:13.8888888889%}}\@media (min-width:1440px){.col-xl-6{-ms-flex-preferred-size:16.6666666667%;flex-basis:16.6666666667%;width:16.6666666667%;max-width:16.6666666667%}}\@media (min-width:1440px){.col-xl-7{-ms-flex-preferred-size:19.4444444444%;flex-basis:19.4444444444%;width:19.4444444444%;max-width:19.4444444444%}}\@media (min-width:1440px){.col-xl-8{-ms-flex-preferred-size:22.2222222222%;flex-basis:22.2222222222%;width:22.2222222222%;max-width:22.2222222222%}}\@media (min-width:1440px){.col-xl-9{-ms-flex-preferred-size:25%;flex-basis:25%;width:25%;max-width:25%}}\@media (min-width:1440px){.col-xl-10{-ms-flex-preferred-size:27.7777777778%;flex-basis:27.7777777778%;width:27.7777777778%;max-width:27.7777777778%}}\@media (min-width:1440px){.col-xl-11{-ms-flex-preferred-size:30.5555555556%;flex-basis:30.5555555556%;width:30.5555555556%;max-width:30.5555555556%}}\@media (min-width:1440px){.col-xl-12{-ms-flex-preferred-size:33.3333333333%;flex-basis:33.3333333333%;width:33.3333333333%;max-width:33.3333333333%}}\@media (min-width:1440px){.col-xl-13{-ms-flex-preferred-size:36.1111111111%;flex-basis:36.1111111111%;width:36.1111111111%;max-width:36.1111111111%}}\@media (min-width:1440px){.col-xl-14{-ms-flex-preferred-size:38.8888888889%;flex-basis:38.8888888889%;width:38.8888888889%;max-width:38.8888888889%}}\@media (min-width:1440px){.col-xl-15{-ms-flex-preferred-size:41.6666666667%;flex-basis:41.6666666667%;width:41.6666666667%;max-width:41.6666666667%}}\@media (min-width:1440px){.col-xl-16{-ms-flex-preferred-size:44.4444444444%;flex-basis:44.4444444444%;width:44.4444444444%;max-width:44.4444444444%}}\@media (min-width:1440px){.col-xl-17{-ms-flex-preferred-size:47.2222222222%;flex-basis:47.2222222222%;width:47.2222222222%;max-width:47.2222222222%}}\@media (min-width:1440px){.col-xl-18{-ms-flex-preferred-size:50%;flex-basis:50%;width:50%;max-width:50%}}\@media (min-width:1440px){.col-xl-19{-ms-flex-preferred-size:52.7777777778%;flex-basis:52.7777777778%;width:52.7777777778%;max-width:52.7777777778%}}\@media (min-width:1440px){.col-xl-20{-ms-flex-preferred-size:55.5555555556%;flex-basis:55.5555555556%;width:55.5555555556%;max-width:55.5555555556%}}\@media (min-width:1440px){.col-xl-21{-ms-flex-preferred-size:58.3333333333%;flex-basis:58.3333333333%;width:58.3333333333%;max-width:58.3333333333%}}\@media (min-width:1440px){.col-xl-22{-ms-flex-preferred-size:61.1111111111%;flex-basis:61.1111111111%;width:61.1111111111%;max-width:61.1111111111%}}\@media (min-width:1440px){.col-xl-23{-ms-flex-preferred-size:63.8888888889%;flex-basis:63.8888888889%;width:63.8888888889%;max-width:63.8888888889%}}\@media (min-width:1440px){.col-xl-24{-ms-flex-preferred-size:66.6666666667%;flex-basis:66.6666666667%;width:66.6666666667%;max-width:66.6666666667%}}\@media (min-width:1440px){.col-xl-25{-ms-flex-preferred-size:69.4444444444%;flex-basis:69.4444444444%;width:69.4444444444%;max-width:69.4444444444%}}\@media (min-width:1440px){.col-xl-26{-ms-flex-preferred-size:72.2222222222%;flex-basis:72.2222222222%;width:72.2222222222%;max-width:72.2222222222%}}\@media (min-width:1440px){.col-xl-27{-ms-flex-preferred-size:75%;flex-basis:75%;width:75%;max-width:75%}}\@media (min-width:1440px){.col-xl-28{-ms-flex-preferred-size:77.7777777778%;flex-basis:77.7777777778%;width:77.7777777778%;max-width:77.7777777778%}}\@media (min-width:1440px){.col-xl-29{-ms-flex-preferred-size:80.5555555556%;flex-basis:80.5555555556%;width:80.5555555556%;max-width:80.5555555556%}}\@media (min-width:1440px){.col-xl-30{-ms-flex-preferred-size:83.3333333333%;flex-basis:83.3333333333%;width:83.3333333333%;max-width:83.3333333333%}}\@media (min-width:1440px){.col-xl-31{-ms-flex-preferred-size:86.1111111111%;flex-basis:86.1111111111%;width:86.1111111111%;max-width:86.1111111111%}}\@media (min-width:1440px){.col-xl-32{-ms-flex-preferred-size:88.8888888889%;flex-basis:88.8888888889%;width:88.8888888889%;max-width:88.8888888889%}}\@media (min-width:1440px){.col-xl-33{-ms-flex-preferred-size:91.6666666667%;flex-basis:91.6666666667%;width:91.6666666667%;max-width:91.6666666667%}}\@media (min-width:1440px){.col-xl-34{-ms-flex-preferred-size:94.4444444444%;flex-basis:94.4444444444%;width:94.4444444444%;max-width:94.4444444444%}}\@media (min-width:1440px){.col-xl-35{-ms-flex-preferred-size:97.2222222222%;flex-basis:97.2222222222%;width:97.2222222222%;max-width:97.2222222222%}}\@media (min-width:1440px){.col-xl-36{-ms-flex-preferred-size:100%;flex-basis:100%;width:100%;max-width:100%}}\@media (min-width:1440px){.col-offset-xl-0{margin-left:0}}\@media (min-width:1440px){.col-offset-xl-1{margin-left:2.7777777778%}}\@media (min-width:1440px){.col-offset-xl-2{margin-left:5.5555555556%}}\@media (min-width:1440px){.col-offset-xl-3{margin-left:8.3333333333%}}\@media (min-width:1440px){.col-offset-xl-4{margin-left:11.1111111111%}}\@media (min-width:1440px){.col-offset-xl-5{margin-left:13.8888888889%}}\@media (min-width:1440px){.col-offset-xl-6{margin-left:16.6666666667%}}\@media (min-width:1440px){.col-offset-xl-7{margin-left:19.4444444444%}}\@media (min-width:1440px){.col-offset-xl-8{margin-left:22.2222222222%}}\@media (min-width:1440px){.col-offset-xl-9{margin-left:25%}}\@media (min-width:1440px){.col-offset-xl-10{margin-left:27.7777777778%}}\@media (min-width:1440px){.col-offset-xl-11{margin-left:30.5555555556%}}\@media (min-width:1440px){.col-offset-xl-12{margin-left:33.3333333333%}}\@media (min-width:1440px){.col-offset-xl-13{margin-left:36.1111111111%}}\@media (min-width:1440px){.col-offset-xl-14{margin-left:38.8888888889%}}\@media (min-width:1440px){.col-offset-xl-15{margin-left:41.6666666667%}}\@media (min-width:1440px){.col-offset-xl-16{margin-left:44.4444444444%}}\@media (min-width:1440px){.col-offset-xl-17{margin-left:47.2222222222%}}\@media (min-width:1440px){.col-offset-xl-18{margin-left:50%}}\@media (min-width:1440px){.col-offset-xl-19{margin-left:52.7777777778%}}\@media (min-width:1440px){.col-offset-xl-20{margin-left:55.5555555556%}}\@media (min-width:1440px){.col-offset-xl-21{margin-left:58.3333333333%}}\@media (min-width:1440px){.col-offset-xl-22{margin-left:61.1111111111%}}\@media (min-width:1440px){.col-offset-xl-23{margin-left:63.8888888889%}}\@media (min-width:1440px){.col-offset-xl-24{margin-left:66.6666666667%}}\@media (min-width:1440px){.col-offset-xl-25{margin-left:69.4444444444%}}\@media (min-width:1440px){.col-offset-xl-26{margin-left:72.2222222222%}}\@media (min-width:1440px){.col-offset-xl-27{margin-left:75%}}\@media (min-width:1440px){.col-offset-xl-28{margin-left:77.7777777778%}}\@media (min-width:1440px){.col-offset-xl-29{margin-left:80.5555555556%}}\@media (min-width:1440px){.col-offset-xl-30{margin-left:83.3333333333%}}\@media (min-width:1440px){.col-offset-xl-31{margin-left:86.1111111111%}}\@media (min-width:1440px){.col-offset-xl-32{margin-left:88.8888888889%}}\@media (min-width:1440px){.col-offset-xl-33{margin-left:91.6666666667%}}\@media (min-width:1440px){.col-offset-xl-34{margin-left:94.4444444444%}}\@media (min-width:1440px){.col-offset-xl-35{margin-left:97.2222222222%}}\@media (min-width:1440px){.col-offset-xl-36{margin-left:100%}}\@media (min-width:1440px){.col-offset-right-XL-1{margin-right:2.7777777778%}}\@media (min-width:1440px){.col-offset-right-XL-2{margin-right:5.5555555556%}}\@media (min-width:1440px){.col-offset-right-XL-3{margin-right:8.3333333333%}}\@media (min-width:1440px){.col-offset-right-XL-4{margin-right:11.1111111111%}}\@media (min-width:1440px){.col-offset-right-XL-5{margin-right:13.8888888889%}}\@media (min-width:1440px){.col-offset-right-XL-6{margin-right:16.6666666667%}}\@media (min-width:1440px){.col-offset-right-XL-7{margin-right:19.4444444444%}}\@media (min-width:1440px){.col-offset-right-XL-8{margin-right:22.2222222222%}}\@media (min-width:1440px){.col-offset-right-XL-9{margin-right:25%}}\@media (min-width:1440px){.col-offset-right-XL-10{margin-right:27.7777777778%}}\@media (min-width:1440px){.col-offset-right-XL-11{margin-right:30.5555555556%}}\@media (min-width:1440px){.col-offset-right-XL-12{margin-right:33.3333333333%}}\@media (min-width:1440px){.col-offset-right-XL-13{margin-right:36.1111111111%}}\@media (min-width:1440px){.col-offset-right-XL-14{margin-right:38.8888888889%}}\@media (min-width:1440px){.col-offset-right-XL-15{margin-right:41.6666666667%}}\@media (min-width:1440px){.col-offset-right-XL-16{margin-right:44.4444444444%}}\@media (min-width:1440px){.col-offset-right-XL-17{margin-right:47.2222222222%}}\@media (min-width:1440px){.col-offset-right-XL-18{margin-right:50%}}.grid-col-center{-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}');
styles.set('sc-grid-container',':global *{vertical-align:baseline;border:0 none;padding:0;margin:0;-webkit-box-sizing:border-box;box-sizing:border-box}:global a,:global abbr,:global acronym,:global address,:global applet,:global big,:global blockquote,:global body,:global button,:global caption,:global cite,:global code,:global dd,:global del,:global dfn,:global div,:global dl,:global dt,:global em,:global fieldset,:global font,:global form,:global h1,:global h2,:global h3,:global h4,:global h5,:global h6,:global html,:global iframe,:global img,:global ins,:global kbd,:global label,:global legend,:global li,:global object,:global ol,:global p,:global pre,:global q,:global s,:global samp,:global small,:global span,:global strike,:global strong,:global sub,:global sup,:global table,:global tbody,:global td,:global tfoot,:global th,:global thead,:global tr,:global tt,:global ul,:global var{font-family:inherit;color:inherit;font-size:inherit;line-height:inherit;letter-spacing:inherit;font-weight:inherit;font-style:inherit;vertical-align:inherit;border:0 none;padding:0;margin:0}:global img{width:100%;height:auto;display:block}:global figure{margin:0}:global button{border:none;border-radius:0;background-color:transparent;cursor:pointer}:global [role=button],:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{background:none;border:0;color:inherit;font:inherit;line-height:normal;overflow:visible;padding:0;-webkit-appearance:button;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}:global button::-moz-focus-inner,:global input::-moz-focus-inner{border:0;padding:0}:global strong{font-weight:700}:global li{list-style-type:none}:global a{text-decoration:none;cursor:pointer;line-height:normal}:focus{-webkit-transition-delay:0ms;transition-delay:0ms}:global a,:global em,:global span,:global strong{font-size:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;font-family:inherit}.grid-container{width:100%;margin:0 auto;display:block}');
styles.set('sc-grid-ghost',':global *{vertical-align:baseline;border:0 none;padding:0;margin:0;-webkit-box-sizing:border-box;box-sizing:border-box}:global a,:global abbr,:global acronym,:global address,:global applet,:global big,:global blockquote,:global body,:global button,:global caption,:global cite,:global code,:global dd,:global del,:global dfn,:global div,:global dl,:global dt,:global em,:global fieldset,:global font,:global form,:global h1,:global h2,:global h3,:global h4,:global h5,:global h6,:global html,:global iframe,:global img,:global ins,:global kbd,:global label,:global legend,:global li,:global object,:global ol,:global p,:global pre,:global q,:global s,:global samp,:global small,:global span,:global strike,:global strong,:global sub,:global sup,:global table,:global tbody,:global td,:global tfoot,:global th,:global thead,:global tr,:global tt,:global ul,:global var{font-family:inherit;color:inherit;font-size:inherit;line-height:inherit;letter-spacing:inherit;font-weight:inherit;font-style:inherit;vertical-align:inherit;border:0 none;padding:0;margin:0}:global img{width:100%;height:auto;display:block}:global figure{margin:0}:global button{border:none;border-radius:0;background-color:transparent;cursor:pointer}:global [role=button],:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{background:none;border:0;color:inherit;font:inherit;line-height:normal;overflow:visible;padding:0;-webkit-appearance:button;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}:global button::-moz-focus-inner,:global input::-moz-focus-inner{border:0;padding:0}:global strong{font-weight:700}:global li{list-style-type:none}:global a{text-decoration:none;cursor:pointer;line-height:normal}:focus{-webkit-transition-delay:0ms;transition-delay:0ms}:global a,:global em,:global span,:global strong{font-size:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;font-family:inherit}.grid-ghost{width:100%;height:100%;display:block;position:fixed;top:0;left:0;pointer-events:none;z-index:9999}.full-height,.item{height:100%}.item:nth-child(odd){background-color:rgba(255,0,0,.1)}.item:nth-child(n+18){display:none}\@media (min-width:420px){.item:nth-child(n+18){display:block}}');
styles.set('sc-grid-row',':global *{vertical-align:baseline;border:0 none;padding:0;margin:0;-webkit-box-sizing:border-box;box-sizing:border-box}:global a,:global abbr,:global acronym,:global address,:global applet,:global big,:global blockquote,:global body,:global button,:global caption,:global cite,:global code,:global dd,:global del,:global dfn,:global div,:global dl,:global dt,:global em,:global fieldset,:global font,:global form,:global h1,:global h2,:global h3,:global h4,:global h5,:global h6,:global html,:global iframe,:global img,:global ins,:global kbd,:global label,:global legend,:global li,:global object,:global ol,:global p,:global pre,:global q,:global s,:global samp,:global small,:global span,:global strike,:global strong,:global sub,:global sup,:global table,:global tbody,:global td,:global tfoot,:global th,:global thead,:global tr,:global tt,:global ul,:global var{font-family:inherit;color:inherit;font-size:inherit;line-height:inherit;letter-spacing:inherit;font-weight:inherit;font-style:inherit;vertical-align:inherit;border:0 none;padding:0;margin:0}:global img{width:100%;height:auto;display:block}:global figure{margin:0}:global button{border:none;border-radius:0;background-color:transparent;cursor:pointer}:global [role=button],:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{background:none;border:0;color:inherit;font:inherit;line-height:normal;overflow:visible;padding:0;-webkit-appearance:button;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}:global button::-moz-focus-inner,:global input::-moz-focus-inner{border:0;padding:0}:global strong{font-weight:700}:global li{list-style-type:none}:global a{text-decoration:none;cursor:pointer;line-height:normal}:focus{-webkit-transition-delay:0ms;transition-delay:0ms}:global a,:global em,:global span,:global strong{font-size:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;font-family:inherit}.grid-row{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap}.jc-initial{-ms-flex-pack:initial;justify-content:normal}.jc-flex-start{-ms-flex-pack:start;justify-content:flex-start}.jc-flex-end{-ms-flex-pack:end;justify-content:flex-end}.jc-start{-ms-flex-pack:start;justify-content:start}.jc-end{-ms-flex-pack:end;justify-content:end}.jc-baseline{-ms-flex-pack:baseline;justify-content:baseline}.jc-left{-ms-flex-pack:left;justify-content:left}.jc-right{-ms-flex-pack:right;justify-content:right}.jc-center,.x-center{-ms-flex-pack:center;justify-content:center}.jc-safe{-ms-flex-pack:safe;justify-content:safe}.jc-stretch{-ms-flex-pack:stretch;justify-content:stretch}.jc-space-around{-ms-flex-pack:distribute;justify-content:space-around}.jc-space-between{-ms-flex-pack:justify;justify-content:space-between}.jc-space-evenly{-ms-flex-pack:space-evenly;justify-content:space-evenly}.jc-center-only-mobile{-ms-flex-pack:center;justify-content:center}\@media (min-width:768px){.jc-center-only-mobile{-ms-flex-pack:initial;justify-content:normal}}.ai-initial{-ms-flex-align:initial;align-items:normal}.ai-flex-start{-ms-flex-align:start;align-items:flex-start}.ai-flex-end{-ms-flex-align:end;align-items:flex-end}.ai-start{-ms-flex-align:start;align-items:start}.ai-end{-ms-flex-align:end;align-items:end}.ai-baseline{-ms-flex-align:baseline;align-items:baseline}.ai-left{-ms-flex-align:left;align-items:left}.ai-right{-ms-flex-align:right;align-items:right}.ai-center,.y-center{-ms-flex-align:center;align-items:center}.ai-safe{-ms-flex-align:safe;align-items:safe}.ai-stretch{-ms-flex-align:stretch;align-items:stretch}.ai-space-around{-ms-flex-align:space-around;align-items:space-around}.ai-space-between{-ms-flex-align:space-between;align-items:space-between}.ai-space-evenly{-ms-flex-align:space-evenly;align-items:space-evenly}.grid-row-center{-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center}.grid-row-reverse{-ms-flex-direction:row-reverse;flex-direction:row-reverse}');
styles.set('sc-my-component','');
styles.set('sc-simple-button',':global *{vertical-align:baseline;border:0 none;padding:0;margin:0;-webkit-box-sizing:border-box;box-sizing:border-box}:global a,:global abbr,:global acronym,:global address,:global applet,:global big,:global blockquote,:global body,:global button,:global caption,:global cite,:global code,:global dd,:global del,:global dfn,:global div,:global dl,:global dt,:global em,:global fieldset,:global font,:global form,:global h1,:global h2,:global h3,:global h4,:global h5,:global h6,:global html,:global iframe,:global img,:global ins,:global kbd,:global label,:global legend,:global li,:global object,:global ol,:global p,:global pre,:global q,:global s,:global samp,:global small,:global span,:global strike,:global strong,:global sub,:global sup,:global table,:global tbody,:global td,:global tfoot,:global th,:global thead,:global tr,:global tt,:global ul,:global var{font-family:inherit;color:inherit;font-size:inherit;line-height:inherit;letter-spacing:inherit;font-weight:inherit;font-style:inherit;vertical-align:inherit;border:0 none;padding:0;margin:0}:global img{width:100%;height:auto;display:block}:global figure{margin:0}:global button{border:none;border-radius:0;background-color:transparent;cursor:pointer}:global [role=button],:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}:global button,:global input[type=button],:global input[type=reset],:global input[type=submit]{background:none;border:0;color:inherit;font:inherit;line-height:normal;overflow:visible;padding:0;-webkit-appearance:button;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}:global button::-moz-focus-inner,:global input::-moz-focus-inner{border:0;padding:0}:global strong{font-weight:700}:global li{list-style-type:none}:global a{text-decoration:none;cursor:pointer;line-height:normal}:focus{-webkit-transition-delay:0ms;transition-delay:0ms}:global a,:global em,:global span,:global strong{font-size:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;font-family:inherit}.simple-button{background:inherit;border:none;color:inherit;cursor:pointer;display:inline-block;font-family:sans-serif;font-size:1.4rem;padding:1rem 2rem;margin:0;text-align:center;text-decoration:none;-webkit-transition:all .25s ease-in-out;transition:all .25s ease-in-out;-webkit-appearance:none;-moz-appearance:none}.primary{background:#0069ed;color:#fff}.primary:hover{background:#4396fc}.secondary{background:#715aff;color:#fff}.secondary:hover{background:#8a78ff}');

exports.bootstrapHydrate = bootstrapHydrate;
