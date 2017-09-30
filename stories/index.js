import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import HelpDesk from '../src/js/index.js';
import FAQ from '../src/js/components/tabs/FAQ';
import Tutorials from '../src/js/components/tabs/Tutorials';
import { Book, Compass, HelpCircle, MessageSquare } from 'react-feather';

import './style.scss';
import '../src/scss/help-desk.scss';
import '../src/scss/faq.scss';
import '../src/scss/tutorials.scss';

import faqData from './faq';
const walkthroughs = {
  team: {
    title: 'Using the Dashboard',
    thumbnail: 'https://i.imgur.com/ItIdshs.png'
  },
  avatar: {
    title: 'Upload to the gallery',
    thumbnail: 'https://i.imgur.com/T8DZKF7.png'
  },
  dashboard: {
    title: 'Embedding video',
    thumbnail: 'https://i.imgur.com/OUm6qKz.png'
  },
  goals: {
    title: 'Learn how to chat',
    thumbnail: 'https://i.imgur.com/Osp9Xjq.png'
  }
};

storiesOf('React Help Desk', module).add('basic example', () => (
  <div>
    <h1>React Help Desk</h1>
    <p>
      Click on the help button on the right hand side of your screen to open the
      help desk.
    </p>
    <HelpDesk defaultTab="home">
      <HelpDesk.Menu>
        <HelpCircle width="18" height="18" />
      </HelpDesk.Menu>
      <HelpDesk.Content>
        <div name="home">
          <HelpDesk.Header title="Help Center" />
          <HelpDesk.Widgets>
            <HelpDesk.Widget label="FAQ" tab="home">
              <Book width="20" height="20" />
            </HelpDesk.Widget>
            <HelpDesk.Widget label="Tutorials" tab="tutorials">
              <Compass width="20" height="20" />
            </HelpDesk.Widget>
            <HelpDesk.Widget
              label="Live Chat Support"
              onClick={() =>
                action('Open the live chat box with their JS API')()}
              externalAction
            >
              <MessageSquare width="20" height="20" />
            </HelpDesk.Widget>
          </HelpDesk.Widgets>
          <FAQ json={faqData} onArticleRating={action('Article rated')} />
        </div>
        <div name="tutorials">
          <HelpDesk.Header title="Tutorials" />
          <Tutorials walkthroughs={walkthroughs} />
        </div>
      </HelpDesk.Content>
    </HelpDesk>
  </div>
));
