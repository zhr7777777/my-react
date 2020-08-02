export class Component {
  constructor() {
    this.children = []
    this.props = Object.create(null)
  }

  get type() {
    return this.constructor.name
  }

  setAttribute(name, value) {
    this.props[name] = value
    this[name] = value
  }

  mountTo(range) {
    // let dom = this.render()
    // dom.mountTo(parent)
    console.log(range)
    this.range = range
    this.update()
  }

  update() {
    // this.range.deleteContents()
    let vdom = this.render()
    if(this.vdom) {
      console.log('old: ', this.vdom)      
      console.log('new: ', vdom)
      let isSameNode = (node1, node2) => {
        if(node1.type !== node2.type) return false
        if(Object.keys(node1).length !== Object.keys(node2).length) return false 
        for(let e in node1.props) {
          if (typeof node1.props[e] === 'function' && typeof node2.props[e] === 'function' && node1.props[e].toString() === node2.props[e].toString()) {
            continue
          }
          if (typeof node1.props[e] === 'object' && typeof node2.props[e] === 'object' && JSON.stringify(node1.props[e]) === JSON.stringify(node2.props[e].toString())) {
            continue
          }
          if (node1.props[e] !== node2.props[e]) {
            return false
          }
        }
        return true
      }
      let isSameTree = (tree1, tree2) => {
        if(!isSameNode(tree1, tree2)) return false
        if(tree1.children.length !== tree2.children.length) return false
        for(let i=0; i<tree1.children.length; i++) {
          if(!isSameTree(tree1.children[i], tree2.children[i])) return false
        }
        return false
      }

      // let replace = (oldT, newT) => {
      //   if (isSameTree(this.vdom, vdom)) return
      //   if (!isSameNode(oldT, newT)) {
      //     vdom.mountTo(this.range)
      //   } else {

      //   }
      // }

      vdom.mountTo(this.range)

    } else {
      vdom.mountTo(this.range)
    }
    this.vdom = vdom
  }

  // get vdom() {
  //   return this.render().vdom
  // }

  appendChild(vchild) {
    this.children.push(vchild)
  }

  setState(state) {
    this.state = { ...this.state, ...state }
    this.update()
  }
}

export class ElementWrapper {
  constructor(type) {
    // this.root = document.createElement(type)
    this.type = type
    this.props = Object.create(null)
    this.children = []
  }

  get vdom() {
    return {
      type: this.type,
      props: this.props,
      children: this.children.map(child => child.vdom)
    }
  }

  setAttribute(name, value) {
    // if(name.match(/^on(.+)$/)) {
    //   this.root.addEventListener(RegExp.$1.toLowerCase(), value)
    // } else if(name === 'className') {
    //   this.root.setAttribute('class', value)
    // } else {
    //   this.root.setAttribute(name, value)
    // }
    this.props[name] = value
  }

  appendChild(vchild) {
    // let range = document.createRange()
    // if (this.root.children.length) {
    //   range.setStartAfter(this.root.lastChild)
    //   range.setEndAfter(this.root.lastChild)
    // } else {
    //   range.setStart(this.root, 0)
    //   range.setEnd(this.root, 0)
    // }
    // vchild.mountTo(range)
    this.children.push(vchild)

    // vchild.mountTo(this.root)
  }

  mountTo(range) {
    // parent.appendChild(this.root)
    // console.log(range)

    range.deleteContents()
    // range.insertNode(this.root)
    let element = document.createElement(this.type)
    for(let name in this.props) {
      let value = this.props[name]
      if(name.match(/^on(.+)$/)) {
        element.addEventListener(RegExp.$1.toLowerCase(), value)
      } else if(name === 'className') {
        element.setAttribute('class', value)
      } else {
        element.setAttribute(name, value)
      }
    }

    for(let child of this.children) {
      let range = document.createRange()
      if (element.children.length) {
        range.setStartAfter(element.lastChild)
        range.setEndAfter(element.lastChild)
      } else {
        range.setStart(element, 0)
        range.setEnd(element, 0)
      }
      child.mountTo(range)
    }

    range.insertNode(element)
  }
}

export class TextElementWrapper {
  constructor(type) {
    this.root = document.createTextNode(type)

    this.type = '_text'
    this.props = Object.create(null)
    this.children = []
  }

  mountTo(range) {
    // parent.appendChild(this.root)
    range.deleteContents()
    range.insertNode(this.root)
  }
}

const MyReact = {
  createElement(type, attributes, ...children) {
    let element
    if(typeof type === 'string') {
      element = new ElementWrapper(type)
    } else {
      element = new type
    }
    for(let name in attributes) {
      element.setAttribute(name, attributes[name])
    }
    children.forEach(child => {
      if (child === null || child === void 0) {
        child = ''
      }
      if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
        child = new TextElementWrapper(child)
      }
      if (Array.isArray(child)) {
        child.forEach(ch => {
          element.appendChild(ch)
        })
      } else {
        element.appendChild(child)
      }
    })
    return element
  },
  render(vdom, element) {
    // console.log(vdom)
    // vdom.mountTo(element)

    let range = document.createRange()
    if(element.children.length) {
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    } else {
      range.setStart(element, 0)
      range.setEnd(element, 0)
    }
    vdom.mountTo(range)
    // todo: vdom -> real dom
  }
}

export default MyReact