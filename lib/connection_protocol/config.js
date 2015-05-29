SkillShareConfig = {
	"serverProtocol" : "http",
	"serverAddr" : "192.168.0.10",
	"serverPort" : "3000"
};

if (Meteor.isClient) {
	UI.registerHelper("SkillShareConfig", function () {
  		return SkillShareConfig;
	});
}