import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-700 p-4 flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl text-white mb-4">
        Welcome to the CRDA of Mahdia
      </h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl">
        <p className="text-white text-lg mb-4">
          Welcome to our project dedicated to the{" "}
          <strong>CRDA (Commission Régionale de Développement Agricole)</strong>{" "}
          of Mahdia State. This platform is designed to enhance communication
          and facilitate access to essential resources for the development of
          agricultural practices in Mahdia. Developed by{" "}
          <a
            href="https://www.linkedin.com/in/jihed-saad-1a1959276/"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jihed Saad
          </a>{" "}
          and{" "}
          <a
            href="https://www.linkedin.com/in/rayen-ben-aziza-5a2886264/"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rayen Ben Aziza
          </a>
          , and supervised by <strong>Ghazi Chraga</strong>, our goal is to
          provide a user-friendly tool for both the CRDA team and local farmers
          to access information, manage documents, and improve collaborative
          efforts in agricultural development. We hope this project supports the
          growth and sustainability of agriculture in our community.
        </p>
        <a
          href="https://www.facebook.com/crdamahdia/"
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the CRDA Mahdia Facebook Page
        </a>
      </div>
    </div>
  );
};

export default Welcome;
