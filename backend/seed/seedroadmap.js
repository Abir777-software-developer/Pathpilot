import mongoose from "mongoose";
import dotenv from "dotenv";
import { Roadmap } from "../models/Roadmapmodel.js";

dotenv.config();
const roadmaps = [
  {
    title: "MERN Stack",
    slug: "mern",
    imageUrl: "https://roadmap.sh/roadmaps/full-stack.png",
    resources: [
      {
        title: "HTMLand CSS Basics",
        type: "both",
        linka: "https://youtu.be/G3e-cpL7ofc?si=eHyVqCptJltxF91p",
        linkb: "https://www.w3schools.com/html/html_intro.asp",
      },
      {
        title: "Javascript",
        type: "both",
        linka:
          "https://youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37&si=-HYD6_WJu9Dx9Phs",
        linkb: "https://www.w3schools.com/js/js_intro.asp",
      },
      {
        title: "ReactJS",
        type: "both",
        linka:
          "https://youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige&si=NuHMSFUdSCZqTfwl",
        linkb:
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_getting_started",
      },
      {
        title: "NodeJS and ExpressJS",
        type: "both",
        linka: "https://youtu.be/Oe421EPjeBE?si=jZT45RZ0jZf9N5ee",
        linkb:
          "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction",
      },
      {
        title: "SQL",
        type: "both",
        linka: "https://youtu.be/HXV3zeQKqGY?si=sdWfAd_ezaFwPJFW",
        linkb: "https://www.w3schools.com/sql",
      },
      {
        title: "MongoDB",
        type: "both",
        linka: "https://youtu.be/J6mDkcqU_ZE?si=5RGbWKjal02gsiB",
        linkb: "https://www.w3schools.com/mongodb",
      },
    ],
  },
  {
    title: "Android Development",
    slug: "androiddevelopment",
    imageUrl: "https://roadmap.sh/roadmaps/android.png",
    resources: [
      {
        title: "Android and Kotlin",
        type: "both",
        linka: "https://developer.android.com/kotlin",
        linkb: "https://www.geeksforgeeks.org/kotlin-android-tutorial",
      },
    ],
  },
  {
    title: "Flutter",
    slug: "flutter",
    imageUrl: "https://roadmap.sh/roadmaps/flutter.png",
    resources: [
      {
        title: "Flutter Tutorial",
        type: "both",
        linka: "https://youtu.be/VPvVD8t02U8?si=qx8LCvmIBQectnZZ",
        linkb: "https://docs.flutter.dev",
      },
    ],
  },
];
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Roadmap.deleteMany();
    await Roadmap.insertMany(roadmaps);
    console.log("Roadmaps seeded successfully");
    process.exit();
  } catch (error) {
    console.log("error while seeding", error);
    process.exit(1);
  }
};
seed();
