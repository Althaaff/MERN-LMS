import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

const FooterComponent = () => {
  return (
    <div className="p-9 bg-[#eee9e9]">
      <section className="w-full flex flex-col gap-4">
        <div className="flex flex-col p-2 md:flex-row items-center gap-5 mx-auto">
          <div className=" flex flex-col items-center gap-4 mb-20">
            <div className="">
              <h2 className="text-blue-500 hover:underline cursor-pointer font-normal">
                LEARNTODAY.COM
              </h2>
            </div>

            <ul className="">
              <li className=" flex gap-2 text-blue-400 font-bold text-2xl">
                <a href="" className="text-decoration: none">
                  <Instagram />
                </a>

                <a href="" className="text-decoration: none">
                  <Github />
                </a>

                <a href="" className="text-decoration: none">
                  <Linkedin />
                </a>

                <a href="" className="text-decoration: none">
                  <Twitter />
                </a>
              </li>
            </ul>

            <div className="flex flex-col items-center gap-2">
              <p className="font-normal text-gray-500">©2025 eduverse.in</p>
              <div className="">
                <p className="font-normal text-gray-500 ">
                  learntoday is a registered trademark.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-24 flex-wrap">
            <div className="flex flex-col items-center gap-4 mb-15">
              <h2 className="font-bold text-2xl">Courses</h2>
              <ul className="flex flex-col items-center gap-2 text-gray-500 font-normal">
                <li>Classroom courses</li>
                <li>Virtual classroom courses</li>
                <li>E-learning courses</li>
                <li>Video Courses</li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-4">
              <h2 className="font-bold text-2xl">Community</h2>
              <ul className="flex flex-col items-center gap-2 text-gray-500 font-normal">
                <li>Learners</li>
                <li>Partners</li>
                <li>Developers</li>
                <li>Transaction</li>
                <li>Blog</li>
                <li>Teaching center</li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-4">
              <h2 className="font-bold text-2xl">Quick Links</h2>
              <ul className="flex flex-col items-center gap-2 text-gray-500 font-normal">
                <li>Home</li>
                <li>Professional Education</li>
                <li>Courses</li>
                <li>Admission</li>
                <li>Testimonial</li>
                <li>Programs</li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-4">
              <h2 className="font-bold text-2xl">More</h2>
              <ul className="flex flex-col items-center gap-2 text-gray-500 font-normal">
                <li>Press</li>
                <li>Investors</li>
                <li>Teams</li>
                <li>Privacy</li>
                <li>Help</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-3 mt-10 bg-[lightgray] rounded-md mx-auto w-full max-w-screen-xl">
          <div className="flex items-center gap-10 justify-between">
            <p className="text-gray-700 font-normal">
              Privacy policy | Terms & Conditions
            </p>
            <p className="text-gray-700 font-normal">
              All copyright (c) 2024 reserved
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FooterComponent;
