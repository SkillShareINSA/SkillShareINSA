SkillShareConfig = {
	"serverProtocol" : "http",
	"serverAddr" : "172.20.10.5",
	"serverPort" : ""
};

if (Meteor.isClient) {
	UI.registerHelper("SkillShareConfig", function () {
  		return SkillShareConfig;
	});
}