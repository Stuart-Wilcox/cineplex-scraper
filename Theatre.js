class Theatre {
  constructor(theatre){
    /*
    theatre: {
      name: string, ex 'Galaxy Cinemas Brantford',
      logourl: string, ex 'img width="90" height="120" src="..." alt="Galaxy"/>',
      address: string, ex '300 King George Road',
      city: string, ex 'Brantford',
      province: string, ex 'ON',
      provinceabbr: string, ex '',
      postalcode: string, ex 'N3R 5L7',
      url: string, ex 'galaxy-cinemas-brantford'
    }
    */

    this.name = theatre.name;
    this.address = theatre.address;
    this.city = theatre.city;
    this.province = theatre.province;
    this.postalCode = theatre.postalcode;
    this.nameURL = theatre.url;
  }
}

module.exports = Theatre;
