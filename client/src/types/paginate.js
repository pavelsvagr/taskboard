import PropTypes from "prop-types"

export default (innerShape) =>
  PropTypes.shape({
    offset: PropTypes.number,
    limit: PropTypes.number,
    count: PropTypes.number,
    sort: PropTypes.objectOf(PropTypes.number),
    data: PropTypes.arrayOf(innerShape),
  })
