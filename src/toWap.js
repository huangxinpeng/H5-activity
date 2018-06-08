

function hideTitle(){
	if(navigator.userAgent.indexOf('smkVersion') >= 0){
    var ifr = document.createElement('iframe')
    ifr.src = 'smknative://hideTitle'
    ifr.style.display = 'none'
    document.body.appendChild(ifr)
  }
}

function showTitle(){ 
  if(navigator.userAgent.indexOf('smkVersion') >= 0){
    var ifr = document.createElement('iframe')
    ifr.src = 'smknative://showTitle'
    ifr.style.display = 'none'
    document.body.appendChild(ifr)
  }
}

function closeWeb(){
  if(navigator.userAgent.indexOf('smkVersion') >= 0){
    var ifr = document.createElement('iframe')
    ifr.src = 'smkapp://closeWebViewAction'
    ifr.style.display = 'none'
    document.body.appendChild(ifr)
  }
}

export default class wapTitle {
  constructor(key){
    this.hide = hideTitle
    this.show = showTitle
    this.closeWeb = closeWeb
  }
}