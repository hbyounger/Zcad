cb.views.register('LoginViewController', function(controllerName) {
	var view = function(widgets) {
		cb.views.BaseView.call(this, widgets);
	};
	view.prototype = new cb.views.BaseView();
	view.prototype.controllerName = controllerName;
	view.prototype.init = function() {
		var _this = this;
		var proxy = cb.rest.DynamicProxy.create({
			authorize: {
				url: 'login/getCorpAccounts.do',
				method: 'POST'
			},
			submit:{
				url:'login/authorize.do',
				method:'POST'
			}
		});
		var hiddenTitle = function() {
			$(".login-title").hide();
			$("#errorMsg").show();
		};
		var hiddenError = function() {
			$(".login-title").show();
			$("#errorMsg").hide();
		}
		var emptyAccountUL = function() {
			var accountUL = $("#accountSelect");
			accountUL.empty();
			$("#accountSelect").append("<option value='' disabled selected style='display:none;'>请选择账套</option> ");
		};
		var usernameValid = function() {
			emptyAccountUL();
			var username = $.trim($("#username").val());
			if (!username || username == "") {
				$("#errorMsg").html("登录账号不能为空，请输入");
				hiddenTitle();
				return;
			} else {
				hiddenError();
			}
			return username;
		};

		var pwdEmpty = function() {
			emptyAccountUL();
			var password = $("#password").val();
			if (!password || password == "") {
				$("#errorMsg").html("密码不能空，请输入");
				hiddenTitle();
				return;

			} else {
				hiddenError();
			}
			return password;
		};
		$("#username").blur(function() {
			usernameValid();
		});
		$("#password").blur(function() {
			var username = usernameValid();
			if (!username) return;
			var password = pwdEmpty();
			if (!password) return;
			
			var user = {
				"username": username,
				"password": password
			};
			proxy.authorize(user, function(err, suc) {
				if (err) {
					$("#errorMsg").html(err.message);
					hiddenTitle();
					emptyAccountUL();
					return;
				}
				var accounts = suc;
				if (accounts && accounts.length > 0) {
					$("#corp_id").val(accounts[0].corp_id);
					var options="";
					//var options = "<option>请选择账套</option>";
					$.each(accounts, function(n,data) {
						options+="<option value="+data.code+">"+data.accountname+"</option>";
					});
					$("#accountSelect").empty();
					$("#accountSelect").append(options);
				}
			});
		});
		
		$("#submit").click(function(e) {
			var accountcode=$("#accountSelect").val();
			if(!accountcode) {
				$("#errorMsg").html("账套信息不能空，请选择");
				$("#errorMsg").show();
				return;
			}
			var username=$.trim($("#username").val());
			var password=$("#password").val();
			if(!accountcode || accountcode.trim()==""){
				$("#errorMsg").html("账套信息获取失败，请重新选择");
					hiddenTitle();
					emptyAccountUL();
			};
			var corp_id=$("#corp_id").val();
			
			var params={
				"username":username,
				"code":accountcode,
				"corp_id":corp_id
			};
			proxy.submit(params, function(err, suc) {
				if (err) {
					$("#errorMsg").html(err.message);
					hiddenTitle();
					return;
				}else{
					cb.data.CookieParser.setCookie('cUserName', suc.username);
					cb.data.CookieParser.setCookie('token', suc.token);
				    window.location.href = "index";
				}
			});
		});
	};
	view.prototype.getProxyData = function(widgetName) {};

	return view;
});