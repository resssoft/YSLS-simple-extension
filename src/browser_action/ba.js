
let storageGroupKey = 'rs_groups'
let apiURL = 'http://localhost:8091'


document.addEventListener("DOMContentLoaded", ready);

  async function ready() {

	document.getElementById("login").onclick = function() {
		$('#ErrorPopup').text('')
    	fetch(apiURL + '/api/auth/sign-in', {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json;charset=utf-8'
		  },
		  body: JSON.stringify({
   			 username: $('#username').val(),
    		 password: $('#password').val()
		  })
		}).then(function(response) {
		  console.log(response.status);
		  if (!response.ok) {
		  	$('#ErrorPopup').text('Login error')
		  	return
		  }
		  response.json().then(function(loginData) {
  			$('#mainPopup').show()
  			$('#loginPopup').hide()
		    console.log(loginData.accessToken);
		    saveToken(loginData.accessToken);
		    setUserInfo()
		  });
		})
	};

	  document.getElementById("logout").onclick = function() {
		  $('#mainPopup').hide()
		  $('#loginPopup').show()

	  };

  	var token = await getToken()
  	if (token == '' || token == undefined || token == null ) {
  		$('#mainPopup').hide()
  		$('#loginPopup').show()
  	} else {
  		$('#loginPopup').hide()
  		setUserInfo()
  	}
  	
  	showQuickItems()
  	
	document.getElementById("savelinks").onclick = function() {
  		console.log("savelinks onCLICK")
		saveLinkTo(getParamsCollection())
	}//{collectionFromElement($(this));}

	$(document).ready(function() {
        $('.lastsavelinkaction').click(function() {
			console.log("savelinks onCLICK")
			saveLinkTo(getParamsCollection(
				$(this).attr("group"),
				$(this).attr("assignment"),
				$(this).attr("favorite") === "1",
				$(this).attr("cache") === "1",
				$(this).attr("processed") === "1",
				$(this).attr("preview") === "1"
			))
		});
    });

  	// click by save button with params
	document.getElementById("savelinksWithGroup").onclick = function() {
		var selectedGroupIndex = document.getElementById("groupName").selectedIndex
		var selectedGroup = document.getElementById("groupName").options[selectedGroupIndex].value
		if (selectedGroup == '') {
			selectedGroup = document.getElementById("newGroup").value
		} else {
			selectedGroup = document.getElementById("groupName").options[selectedGroupIndex].value
		}

		var selectedAssignment = '' 
		var selectedAssignmentIndex = document.getElementById("assignmentName").selectedIndex
		var selectedAssignment = document.getElementById("assignmentName").options[selectedAssignmentIndex].value

		var paramsCollection = getParamsCollection(selectedGroup, selectedAssignment,
			$('#flag_favorite').prop('checked'),
			$('#flag_cache').prop('checked'),
			$('#flag_processed').prop('checked'),
			$('#flag_preview').prop('checked'));

		saveLinkTo(paramsCollection);

		if (selectedGroup != '') {
			var opt = document.createElement('option');
			opt.appendChild( document.createTextNode(selectedGroup) );
			opt.value = selectedGroup;
			document.getElementById("groupName").appendChild(opt);
			document.getElementById("newGroup").value = ''

			saveParamsCollection(paramsCollection)
			addUniqQuickItem(paramsCollection)

			setGroup(selectedGroup)
		}
	};
  }


	function collectionFromElement(el) {
		saveLinkTo(getParamsCollection(
			el.attr("group"),
			el.attr("assignment"),
			el.attr("favorite") === "1",
			el.attr("cache") === "1",
			el.attr("processed") === "1",
			el.attr("preview") === "1"
		))
	}


	function groupsSelectAppend(name) {
		var opt = document.createElement('option');
		opt.appendChild( document.createTextNode(name) );
		opt.value = name;
		document.getElementById("groupName").appendChild(opt);
	}

  async function showQuickItems() {
  	var paramsCollections = await getParamsCollections()
  	paramsCollections.forEach(function qwe(element) {
  		addQuickItem(element)

		//TODO: move to load after save groups list from API to cache
		//create select option with groupName
		groupsSelectAppend(element.group)
  	});
  }

	async function addUniqQuickItem(paramsCollection) {
		var paramsCollections = await getParamsCollections()
		var isUniq = paramsCollections.every(function qwe(element) {
			if (
				element.group !== paramsCollection.group
			) {
				return true
			} else {
				if (
					element.assignment == paramsCollection.assignment &&
					element.favorite == paramsCollection.favorite &&
					element.cache == paramsCollection.cache &&
					element.processed == paramsCollection.processed &&
					element.preview == paramsCollection.preview
				) {
					return false
				} else {
					return true
				}
			}
		})
		if (isUniq) {
			addQuickItem(paramsCollection)
		}
	}

  async function addQuickItem(paramsCollection) {
  	var itemParams = { 
			'class': 'lastsavelinkaction lastsavelink', 
			'group': paramsCollection.group, 
			'assignment': paramsCollection.assignment
		}
	var itemName = 'save'
	if (paramsCollection.group != '') {
		itemName += ' [group=' + paramsCollection.group + ']'
	}
	if (paramsCollection.assignment != '') {
		itemName += ' [assig=' + paramsCollection.assignment + ']'
	}
	if (paramsCollection.favorite) {
		itemParams['favorite'] = 1
		itemName += ' ☆'
	}
	if (paramsCollection.cache) {
		itemParams['cache'] = 1
		itemName += ' ⇊'
	}
	if (paramsCollection.processed) {
		itemParams['processed'] = 1
		itemName += ' ↻'
	}
	if (paramsCollection.preview) {
		itemParams['preview'] = 1
		itemName += ' ▩'
	}
	//https://www.utf8icons.com/
	  var quickElementDiv = $('<div>', itemParams).text(itemName).appendTo(document.getElementById("savelinksLast"))
	  quickElementDiv.click(function() {
		  console.log("savelinks CLICK")
		  saveLinkTo(getParamsCollection(
			  $(this).attr("group"),
			  $(this).attr("assignment"),
			  $(this).attr("favorite") === "1",
			  $(this).attr("cache") === "1",
			  $(this).attr("processed") === "1",
			  $(this).attr("preview") === "1"
		  ))
	  });
	//quickElementDiv.click(collectionFromElement($(this)));
  	$('<span>', { 'class': 'lastsavelinkdel', 'param_id': paramsCollection.id }).text('X').appendTo(
		quickElementDiv
	).click(function() {
			delParamsCollection($(this).attr("param_id"))
			$(this).parent().remove()
        });
  }

  async function delParamsCollection(paramsCollectionId) {
  	var paramsCollections = await getParamsCollections()
  	var paramsCollectionsCopy = []
  	paramsCollections.forEach(function qwe(element) {
  		if (element.id != paramsCollectionId) {
  			paramsCollectionsCopy.push(element)
  		}
  	});
	chrome.storage.sync.set({'QParamsCollections': paramsCollectionsCopy});
  }

  function getParamsCollection(group, assignment, fav, cache, processed, prev) {
  	return {
  		id: Date.now(),
  		group: group,
  		assignment: assignment,
  		favorite: fav,
  		cache: cache,
  		processed: processed,
  		preview: prev,
  	}
  }

  async function getParamsCollections() {
	const groups = await getValue('QParamsCollections');
	if (groups['QParamsCollections'] != undefined) {
		return groups['QParamsCollections'];
	} else {
		return []
	}
  }

  async function saveParamsCollection(paramsCollection) {
  	var paramsCollections = await getParamsCollections()

  	console.log('founded Collect: ');
  	console.log(paramsCollections);
  	if (paramsCollections != undefined) {
  		paramsCollections.push(paramsCollection)
  		console.log('save ParamsCollections: ' + paramsCollections);
		chrome.storage.sync.set({'QParamsCollections': paramsCollections});
  	} else {
  		console.log('save ParamsCollections: ');
  		console.log(paramsCollection);
		chrome.storage.sync.set({'QParamsCollections': [paramsCollection]});
  	}
  }










  async function getValue(name) {
      return new Promise(resolve => {
          chrome.storage.sync.get(name, data => {
              resolve(data);
          });
      });
  }
  
  async function getGroups() {
	const groups = await getValue('rsgroups');
  	//console.log('====RESULT' + groups['rsgroups']);
    return groups['rsgroups'];
  }
  
  async function getToken() {
	const tocken = await getValue('token');
  	//console.log('====RESULT token' + tocken['token']);
    return tocken['token'];
  }

  async function getUserInfo() {
	const tocken = await getValue('user');
  	//console.log('====RESULT token' + tocken['user']);
    return tocken['user'];
  }

  async function setGroup(group) {
  	var groups = await getGroups()

  	//console.log('founded: ' + groups);
  	if (groups == '' || groups == undefined || groups == null ) {
  		groups = group
  	} else {
  		groups += ',' + group
  	}
  	//console.log('save: ' + groups);
	chrome.storage.sync.set({'rsgroups': groups});
  }

  async function saveToken(token) {
  	console.log('saved token: ' + token);
	chrome.storage.sync.set({'token': token});
  }

  async function saveUser(user) {
  	console.log('saved user: ' + user);
	chrome.storage.sync.set({'user': user});
  }

	async function removeToken(token) {
		console.log('saved token: ' + token);
		chrome.storage.sync.remove('token');
	}

  async function setUserInfo() {
  		var userInfo = await getUserInfo()
  		if (userInfo == '' || userInfo == undefined || userInfo == null ) {
	    	var token = await getToken()
	    	fetch(apiURL + '/api/user/info/', {
			  method: 'GET',
			  headers: {
			    'Content-Type': 'application/json;charset=utf-8',
			    'Authorization': 'Bearer ' + token
			  }
			}).then(function(response) {
			  console.log(response.status);
			  if (!response.ok) {
			  	$('#ErrorPopup').text('Login error')
			  	return
			  }
			  response.json().then(function(userData) {
			  	userInfo = userData.email
			    console.log(userData);
			    saveUser(userInfo);
			    $('#userInfo #userLogin').text('User: ' + userInfo)
			  });
			})
  		}
  		$('#userInfo #userLogin').text('User: ' + userInfo)
  }

   async function saveLinkTo(paramsCollection) {
	$('#status').text("")
	$('#status').attr('class', 'process');
   	var item = {
	  title: '',
	  type: '',
	  image: '',
	  icon: '',
	  url: '',
	  favorite: false,
	  tags: null,
	  groups: null,
	  assignment: 'webPage'
	};
	console.log("saveLinkTo");
	if (paramsCollection != undefined && paramsCollection != null){
		console.log(paramsCollection);
    	item.groups = [paramsCollection.group]
    	item.assignment = paramsCollection.assignment
    	item.favorite = (paramsCollection.favorite == true || paramsCollection.favorite == 1)
    	////item.cache = (paramsCollection.cache == true || paramsCollection.cache == 1)
    	//item.processed = (paramsCollection.processed == true || paramsCollection.processed == 1)
    	//item.preview = (paramsCollection.preview == true || paramsCollection.preview == 1)
	}
    chrome.tabs.getSelected(null, async function(tab) {
    	item.title = tab.title
    	item.url = tab.url
    	item.icon = tab.favIconUrl
    	console.log(item)
    	var token = await getToken()
    	fetch(apiURL + '/api/item/', {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json;charset=utf-8',
		    'Authorization': 'Bearer ' + token
		  },
		  body: JSON.stringify(item)
		}).then(r => {
			console.log("response");
			console.log(r.status);
			if (r.status >= 200 && r.status <= 300) {
				$('#status').attr('class', 'done');
			}
			if (r.status >= 400 && r.status <= 600) {
				$('#status').attr('class', 'error');
				$('#status').text(" code: " + r.status)
			}
			return r.text()
		}).then(result => {
			console.log("result");
			console.log(result);
		    // Result now contains the response text, do what you want...
		})
	});
    }


/* features
Progress or OK status
save just image from clipboard

find and add description/flag

check, if already saved (how about memory?) check from api or not - save in the browser md5/4 link hash

update times settins for every user extension

*/