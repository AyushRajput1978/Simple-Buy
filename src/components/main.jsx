import React from "react";

const Home = () => {
  return (
    <>
      <div
        className="card border-0 mx-3 hero-banner"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <img
          className="card-img img-fluid"
          src="./assets/coverImage.jpg"
          alt="Card"
          style={{ height: "30rem", objectFit: "cover", opacity: 0.65 }}
        />
        <div className="card-img-overlay d-flex align-items-center">
          <div className="container text-white">
            <h5 className="card-title fs-1 fw-lighter">New Season Arrivals</h5>
            <p className="fs-5 d-none d-sm-block">Be Simple | Be Trendy</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
