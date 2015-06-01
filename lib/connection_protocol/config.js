SkillShareConfig = {
	"serverProtocol" : "http",
	"serverAddr" : "localhost",
	"serverPort" : ""
};

if (Meteor.isClient) {
	UI.registerHelper("SkillShareConfig", function () {
  		return SkillShareConfig;
	});
}