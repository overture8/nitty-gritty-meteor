Questions = new Meteor.Collection('questions');
Respondents = new Meteor.Collection('respondents');

if (Meteor.isClient) {
  Template.assessorView.helpers({
    questions: function() {
      return Questions.find();
    },

    selectedClass: function() {
      if (this.selected) {
        return "selected";
      }
    }
  });

  Template.respondentView.helpers({
    respondents: function() {
      return Respondents.find();
    }
  });

  Template.RespondentShow.helpers({
    currentQuestion: function() {
      return Questions.findOne({selected: true});
    }
  });

  Template.assessorView.events({
    'submit form': function(e, template) {
      e.preventDefault();
      var questionText = $(e.target).find('#question-text').val();
      Questions.insert({desc: questionText, selected: false});
      var form = template.find('form');
      form.reset();
    },

    'click #question-link': function(e, template) {
      e.preventDefault();
      prevSelected = Questions.findOne({selected: true});
      if (prevSelected) {
        Questions.update({_id: prevSelected._id}, { $set: {selected: false} });
      }
      Questions.update({_id: this._id}, {$set: {selected: true}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Respondents.find().count() === 0) {
      Respondents.insert({name: 'John Doe'});
      Respondents.insert({name: 'Walter White'});
      Respondents.insert({name: 'Joe Bloggs'});
      Respondents.insert({name: 'Michael Scofield'});
    }
  });
}

Router.route('/', function () {
  this.render('assessorView');
});
Router.route('/client', function () {
  this.render('clientView');
});
Router.route('/respondent', function () {
  this.render('respondentView');
});
Router.route('/respondent/:_id', {
  name: 'respondent.show',
  data: function () {
    return Respondents.findOne({_id: this.params._id});
  }
});


