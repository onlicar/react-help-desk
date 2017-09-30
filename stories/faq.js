const r = {
  title: 'What is recurison?',
  articles: [{ title: 'Did you mean recursion?', body: 'lol' }]
};

module.exports = {
  categories: [
    {
      title: 'General',
      articles: [
        {
          title: 'What is React Help Desk?',
          body:
            'React Help Desk is a set of React components designed to be the building blocks of a help desk and self-support system for web apps.<br /><br /><iframe width="375" height="211" src="https://www.youtube-nocookie.com/embed/XxVg_s8xAms?rel=0" frameborder="0" allowfullscreen></iframe>'
        },
        {
          title: 'Who built this?',
          body:
            'The front-end team at <a href="https://www.onlicar.com">ONLICAR</a>.<br /><br /><img src="http://i.imgur.com/kKRw2Ar.gif" />'
        }
      ]
    },
    {
      title: 'Tray',
      articles: [
        {
          title: 'What widgets are available?',
          body:
            'Right now, there is an FAQ tab and a Tutorials tab.<br /><br />The FAQ tab accepts an object of categories and/or articles that are shown in a collapsible, searchable view.<br /><br />The Tutorials tab accepts an object of walkthroughs and displays the thumbnail in a grid allowing the user to replay walkthroughs.'
        }
      ],
      categories: [{ ...r, categories: [{ ...r, categories: [{ ...r }] }] }]
    },
    {
      title: 'Walkthroughs',
      articles: [
        {
          title: 'What are walkthroughs?',
          body:
            'Walkthroughs are live in-app tutorials that your users can play any time they want to learn how to do a task in your app.<br /><br />You can create text-based walkthroughs that show a popover next to elements or audio walkthroughs with graphics that are timed up with the voiceover.'
        }
      ]
    }
  ]
};
