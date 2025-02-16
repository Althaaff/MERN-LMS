const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen mb-7">
      <img
        src="https://assets.mongodb-cdn.com/mms/static/images/sadface.gif"
        alt="notfound"
        className="rounded-md mix-blend-darken w-60 h-60"
      />
      <p className="text-red-700 font-bold text-2xl">
        !Oops.. This Page doesnt exist!
      </p>
    </div>
  );
};

export default NotFoundPage;
