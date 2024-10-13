module.exports = (page, pageSize) => {
  page = Number(page);
  pageSize = Number(pageSize);
  return ((page || 1) - 1) * (pageSize || 0);
};