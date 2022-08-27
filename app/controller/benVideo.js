const UserDetails = require("../models/userDetail");
const IdeaDetails = require("../models/ideaDetail");
const ExploereDetails = require("../models/explorerDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;
const msgHeaderAuthkey = process.env.MSG_HEADER;

const video = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId && req.body.type) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const type = parseInt(escapeHtml(req.body.type));
          const verify = await UserDetails.exists({ userId: userId });
          if (verify) {
            if (type == "Board") {
              const result = await ExploereDetails.find().sort().lean().exec();
              if (result) {
                let exploere = [];
                let detail = [];
                let video = ["qODrPblWNNc", "TrKdVSGF4FU", "PT2_F-1esPk"];
                const title = [
                  "Wiz Khalifa- See You Again Ft:Charlie Puth 10 Hours 10H",
                  "Best Music Mix 2022 ♫ No Copyright EDM ♫ Gaming Music, Trap, House, Dubstep",
                  "The Chainsmokers - Closer (Lyric) ft. Halsey",
                ];
                // console.log(result)
                for (let i = 0; i < 3; i++) {
                  detail = {
                    image:
                      "https:docs.vourl.com/uploads/explorerImages/" +
                      result[i].image,
                    video: video[i],
                    title: title[i],
                  };
                  exploere.push(detail);
                }
                res.send({
                  code: 200,
                  status: "success",
                  message: "Successfully",
                  data: exploere,
                });
              } else throw new Error("bv1");
            } else if (type == "Idea") {
              const result = await ExploereDetails.find().sort().lean().exec();
              if (result) {
                let idea = [];
                let detail = [];
                let video = ["qODrPblWNNc", "TrKdVSGF4FU", "PT2_F-1esPk"];
                const title = [
                  "Wiz Khalifa- See You Again Ft:Charlie Puth 10 Hours 10H",
                  "Best Music Mix 2022 ♫ No Copyright EDM ♫ Gaming Music, Trap, House, Dubstep",
                  "The Chainsmokers - Closer (Lyric) ft. Halsey",
                ];
                // console.log(result)
                for (let i = 0; i < 3; i++) {
                  detail = {
                    image:
                      "https:docs.vourl.com/uploads/explorerImages/" +
                      result[i].image,
                    video: video[i],
                    title: title[i],
                  };
                  idea.push(detail);
                }
                res.send({
                  code: 200,
                  status: "success",
                  message: "Successfully",
                  data: idea,
                });
              } else throw new Error("bv1");
            } else if(type == 'Exploere'){
              const result = await ExploereDetails.find().sort().lean().exec();
              if (result) {
                let Service = [];
                let detail = [];
                let video = ["qODrPblWNNc", "TrKdVSGF4FU", "PT2_F-1esPk"];
                const title = [
                  "Wiz Khalifa- See You Again Ft:Charlie Puth 10 Hours 10H",
                  "Best Music Mix 2022 ♫ No Copyright EDM ♫ Gaming Music, Trap, House, Dubstep",
                  "The Chainsmokers - Closer (Lyric) ft. Halsey",
                ];
                // console.log(result)
                for (let i = 0; i < 3; i++) {
                  detail = {
                    image:
                      "https:docs.vourl.com/uploads/explorerImages/" +
                      result[i].image,
                    video: video[i],
                    title: title[i],
                  };
                  Service.push(detail);
                }
                res.send({
                  code: 200,
                  status: "success",
                  message: "Successfully",
                  data: Service,
                });
              } else throw new Error("bv1");
            }else {
              const result = await ExploereDetails.find().sort().lean().exec();
              if (result) {
                let Service = [];
                let detail = [];
                let video = ["qODrPblWNNc", "TrKdVSGF4FU", "PT2_F-1esPk"];
                const title = [
                  "Wiz Khalifa- See You Again Ft:Charlie Puth 10 Hours 10H",
                  "Best Music Mix 2022 ♫ No Copyright EDM ♫ Gaming Music, Trap, House, Dubstep",
                  "The Chainsmokers - Closer (Lyric) ft. Halsey",
                ];
                // console.log(result)
                for (let i = 0; i < 3; i++) {
                  detail = {
                    image:
                      "https:docs.vourl.com/uploads/explorerImages/" +
                      result[i].image,
                    video: video[i],
                    title: title[i],
                  };
                  Service.push(detail);
                }
                res.send({
                  code: 200,
                  status: "success",
                  message: "Successfully",
                  data: Service,
                });
              } else throw new Error("bv1");
            }
            //    const v = idea.map((category) => category.image)
            //    const v1 = idea.filter((category) => category.video.includes("https://www.youtube.com/watch?v=09R8_2nJtjg&list=RD09R8_2nJtjg&start_radio=1"))
            //    const v3 = idea.concat(detail);
            //    console.log(v3)
            //    console.log(v1)
            //    console.log(v);
          } else {
            res.send({
              code: 201,
              status: "fail",
              message: "Invalid User",
            });
          }
        } else {
          res.send({
            code: 201,
            status: "fail",
            message: "Invalid Request",
          });
        }
      } else {
        res.send({
          code: 201,
          status: "invalidAuth",
          message: "Access Denied",
        });
      }
    } else throw new Error("bv1");
  } catch (e) {
    console.log(e.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  video,
};
