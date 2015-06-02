SkillShareConfig = {
	"serverProtocol" : "http",
	"serverAddr" : "www.etud.insa-toulouse.fr/~rprevost",
	"serverPort" : ""
};

if (Meteor.isClient) {
	UI.registerHelper("SkillShareConfig", function () {
  		return SkillShareConfig;
	});
}