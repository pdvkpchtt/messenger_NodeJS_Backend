const redisClient = require("../redis");

module.exports.rateLimiter =
  (secondsLimit, limitAmount) => async (req, res, next) => {
    const ip = req.connection.remoteAddress;

    const [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();

    console.log(response);

    if (response[1] > limitAmount)
      req.json({ loggedIn: false, satus: "Try again in a 60 sec" });
    else next();
  };
