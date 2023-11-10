module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("post", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull : false
      },
      topic: {
        type: DataTypes.STRING,
        allowNull:false
      },
      image:{
        type : DataTypes.STRING,
        allowNull : true
      }    
    });
    return Post;
  };


  