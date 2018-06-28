const config = require('../config');
const site = `${config.server}/images`;
const userStore = require('../lib/store').user;

const isSonyIntegration = process.env.integration !== 'nike';

const getExcelsiroUrl = (openUserId, path) => {
  return `${config.excelsiorServer}/wechat_service/${openUserId}${path}`;
};

const getSigninUrl = (openUserId) => {
  return `${config.uiServer}?user=${openUserId}#/user`;
};

const getProfile = (openUserId) => {
  if (userStore.has(openUserId)) {
    return [{
      title: 'Watir Admin',
      description: 'A short bio description about this person. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in nibh ac nunc imperdiet rutrum. Lorem ipsum dolor sit amet consectetuer',
      picurl: site + '/profile/1.png',
      url: getExcelsiroUrl(openUserId, '/profile')
    }];
  }

  return `您还没有进行<a href="${getSigninUrl(openUserId)}">身份验证</a>，请验证身份后查看My Profile.`
};

const getHotTopics = (openUserId) => {
  return [
    {
      title: 'Sony Television Support Community',
      description: 'A place where you can find solutions and ask questions about Sony Television. Join now - be part of our community!',
      picurl: site + '/topic/support.png',
      url: getExcelsiroUrl(openUserId,
        isSonyIntegration ?
          '/news?link=/topic/ah4AyG4cgiMJhNxvHhTZjB/sony/sony-televisions-support-' :
          '/news?link=/topic/BK7qBGZMHltiXkV3WOxAMN/nike/a-new-tv-experience-awakens'
      )
    },
    {
      title: 'I have an idea to submit',
      description: 'I want to submit an idea to Sony',
      picurl: site + '/topic/idea.jpg',
      url: getExcelsiroUrl(openUserId,
        isSonyIntegration ?
          '/news?link=/topic/aKjSOq3T5W8C2TAtzJsrlE/sony/i-have-an-idea' :
          '/news?link=/topic/BK7qBGZMHltiXkV3WOxAMN/nike/a-new-tv-experience-awakens'
      )
    }, {
      title: 'Latest news from Sony',
      description: 'Check the latest news from Sony',
      picurl: site + '/topic/news.png',
      url: getExcelsiroUrl(openUserId,
        isSonyIntegration ?
          '/news?link=/topic/cQgfeQh4w2G5kvylpY23f9/sony/sony-tv-news' :
          '/news?link=/topic/BK7qBGZMHltiXkV3WOxAMN/nike/a-new-tv-experience-awakens'
      )
    }
  ].slice(0, 1);
};

const getHotBlogs = (openUserId) => {
  return [
    {
      title: 'Sony A8F (AF8) OLED Review',
      picurl: site + '/blog/featured.png',
      description: "Sony’s new OLED TV – A8F in the US and AF8 in Europe – uses the latest 2018 OLED panel and comes with a refreshed design compared to last year’s A1 that won our Reference Award.",
      url: getExcelsiroUrl(openUserId,
        isSonyIntegration ?
          '/news?link=/blog/lRcYGRk4bu4eCGLMYnhWgN/sony/sony-a8f-af8-oled-review' :
          '/news?link=/blog/USY9wV5ojjrBBGEBKbybKw/nike/sony-a8f-af8-oled-review'
      )
    },
    {
      title: 'Everything you watch is sharper and more refined',
      picurl: site + '/blog/3s.jpg',
      url: getExcelsiroUrl(openUserId,
        isSonyIntegration ?
          '/news?link=/blog/0wUwtWf1HCGhVuaOqhEI2r/sony/everything-you-watch-is-sharper-and-more-refined' :
          '/news?link=/blog/pTxjixmCZLPAezHPbUZL4a/sony/a-clearer-more-colorful-picture')
    },
    {
      title: 'Beautifully designed for brilliant pictures',
      picurl: site + '/blog/6.png',
      url: getExcelsiroUrl(openUserId,
        isSonyIntegration ?
          '/news?link=/blog/M8QVOiYLvF93Ydf6RfyYyn/sony/beautifully-designed-for-brilliant-pictures' :
          '/news?link=/blog/7DVHIdp1ywQ3sor1kgxYqa/sony/beautifully-designed-for-brilliant-pictures')
    }
  ];
};

const getSubscribeMessage = (openUserId) => {
  return `Weclome You!
  To make sure you can recive the news and the notifications, please do the <a href="${getSigninUrl(openUserId)}">Authorization Binding</a>, then you can:

  1. Recieve the news
  2. Create Sales Orders
  3. Display/Edit Sales Orders
  4. See your notifications
  
  Have a nice day!
  `;
};

module.exports = {
  getHotTopics,
  getHotBlogs,
  getSubscribeMessage,
  getProfile
};
