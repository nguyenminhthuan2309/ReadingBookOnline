import PropTypes from "prop-types";

const Error = ({ statusCode }) => {
  return (
    <span>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </span>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

Error.propTypes = {
  statusCode: PropTypes.any,
};

export default Error;
