const config = require('../config');
const site = `${config.server}/images`;
const userStore = require('../lib/store').user;
const orderStore = require('../lib/store').order;
const isSonyIntegration = process.env.integration !== 'nike';

const getExcelsiroUrl = (openUserId, path) => {
  return `${config.excelsiorServer}/wechat_service/${openUserId}${path}`;
};

const getAuthorizationCheck = (openUserId) => {
  const email = userStore.has(openUserId);
  if (!email) {
    return `You haven't request authorization yet, please click the link below to request.
<a href="${getSigninUrl(openUserId)}">Request Authorization</a>`
  } else {
    return false;
  }
};

const getSigninUrl = (openUserId) => {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.secret.appid}&redirect_uri=${encodeURIComponent(config.uiServer)}&response_type=code&scope=snsapi_base&state=user#wechat_redirect`
};

const getProfile = (openUserId) => {
  const email = userStore.has(openUserId);
  return `Thank you. Your account had been bound to:
${email}
You can also <a href="${getSigninUrl(openUserId)}">change your authorization</a>.`;
};

const getDisplaySalesOrder = () => {
   return `You can enter the Sales Srder ID to see the details.`
};

const getSalesOrder = (orderId) => {
   const order = orderStore.has(orderId);
   console.log(order); 
   if (!!order) {
      const keys = Object.keys(order);
      console.log(keys);
      let str = '';
      keys.forEach((i) => {
          str = str + `
${i}: ${order[i]}`;
      });
      console.log(str);
      return `Salese order: ${orderId} ${str}`
   } else {
      
      return `${orderId} is not a validate sales order.`;
   }
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
  return `Welcome!
  Here you can manage your sales orders and receive notifications.
  Before you can use this service, please make sure you have an SAP account, and do <a href="${getSigninUrl(openUserId)}">Authorization Request here</a>.
  Have a nice day!`;
};

module.exports = {
  getHotTopics,
  getHotBlogs,
  getSubscribeMessage,
  getProfile,
  getAuthorizationCheck,
  getDisplaySalesOrder,
  getSalesOrder
};
