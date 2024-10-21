const images = {
  'C1.jpg': require('../../assets/images/C1.jpg'),
  'C12.jpg': require('../../assets/images/C12.jpg'),
  'C6.jpg': require('../../assets/images/C6.jpg'),
  'default.jpg': require('../../assets/images/default.jpg'),
  'SC1.jpg': require('../../assets/images/SC1.jpg'),
  'SC11.jpg': require('../../assets/images/SC11.jpg'),
  'SC13.jpg': require('../../assets/images/SC13.jpg'),
  'SC133.jpg': require('../../assets/images/SC133.jpg'),
  'SC14.jpg': require('../../assets/images/SC14.jpg'),
  'SC163.jpg': require('../../assets/images/SC163.jpg'),
  'SC195.jpg': require('../../assets/images/SC195.jpg'),
  'SC2.jpg': require('../../assets/images/SC2.jpg'),
  'SC20.jpg': require('../../assets/images/SC20.jpg'),
  'SC21.jpg': require('../../assets/images/SC21.jpg'),
  'SC22.jpg': require('../../assets/images/SC22.jpg'),
  'SC23.jpg': require('../../assets/images/SC23.jpg'),
  'SC249.jpg': require('../../assets/images/SC249.jpg'),
  'SC26.jpg': require('../../assets/images/SC26.jpg'),
  'SC29.jpg': require('../../assets/images/SC29.jpg'),
  'SC31.jpg': require('../../assets/images/SC31.jpg'),
  'SC32.jpg': require('../../assets/images/SC32.jpg'),
  'SC35.jpg': require('../../assets/images/SC35.jpg'),
  'SC37.jpg': require('../../assets/images/SC37.jpg'),
  'SC5.jpeg': require('../../assets/images/SC5.jpeg'),
  'SC6.jpg': require('../../assets/images/SC6.jpg'),
  'SC7.jpg': require('../../assets/images/SC7.jpg'),
  'SC8.jpg': require('../../assets/images/SC8.jpg')
};

export const getImage = (imageName) => {
  return images[imageName] || require('../../assets/images/default.jpg');
};
