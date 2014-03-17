//
// Action handlers
//

function actionLogin(e) {
	if (!$.inputUsername.value || !$.inputPassword.value) {
		var dialog = Ti.UI.createAlertDialog({
			message : L('formMissingFields', 'Please complete all form fields'),
			ok : 'OK',
			title : L('actionRequired', 'Action Required')
		}).show();
	} else {
		$.activityIndicator.show();
		$.buttonLogin.enabled = false;

		var AppData = require('data');

		AppData.login($.inputUsername.value, $.inputPassword.value, function(response) {
			$.buttonLogin.enabled = true;

			if (response.result === 'ok') {
				if (OS_IOS) {
					Alloy.Globals.navgroup.close();
					Alloy.Globals.navgroup = null;
				} else if (OS_ANDROID) {
					$.loginForm.close();
					$.loginForm = null;
				}
				$.destroy();
				var indexController = Alloy.createController('index').getView();
				indexController.open();

			} else {
				$.inputPassword.value = '';
				alert(L('error', 'E rror') + ':\n' + response.msg);
			}
			$.activityIndicator.hide();

		});
	}
}

function openRegister(e) {
	var registerController = Alloy.createController('register').getView();

	if (OS_IOS) {
		Alloy.Globals.navgroup.open(registerController);
	} else if (OS_ANDROID) {
		registerController.open();
	}
}

//
// View Language
//
$.loginForm.title = L('login', 'Login');
$.inputUsername.hintText = L('username', 'Username');
$.inputPassword.hintText = L('password', 'Password');
$.buttonLogin.title = L('login', 'Login');
