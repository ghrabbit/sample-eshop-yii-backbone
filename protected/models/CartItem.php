<?php
/*
 * CartItem.php
 * 
 */

/**
 * CartItem class.
 * CartItem is the data structure for keeping
 * cart item data.
 */
class CartItem extends CFormModel //not CFormModel, really
{
	public $_id;
    public $qty;
	public $product;
    
    /*function __construct($id, $qty = 0) {
      Yii::log('BEFORE PARENT CONSTRUCT','warning');
      //Yii::log('AFTER PARENT CONSTRUCT','warning');
      $this->product = Product::model()->findByPK($id);
      if(!isset($this->product))
        throw HTTPException("Product by id $id not found.");
      $this->qty = $qty;
    }*/
    
    public static function factory($id, $qty = 0)
    {
       $item = new self;
       $item->_id = $id;
       $item->product = Product::model()->findByPK($id);
       if(!isset($item->product))
         throw HTTPException("Product by id $id not found.");
       $item->qty = $qty; 
       return $item;
    }
	
	function id() 
	{
	  //return $this->product->id;
      return $this->_id;
	}
	
	function title() 
	{
	  return $this->product->title;
	}
	
	function img_file() 
	{
	  return $this->product->img_file;
	}
	
	function price() 
	{
	  return $this->product->price;
	}

	function total() 
	{
	  return $this->product->price*$this->qty;
	}
	
    /*
     * ?
     * */
	function __asString() 
	{
	  return $this->product->price*$this->qty;
	}
	
	/**
	 * Declares the validation rules.
	 */
	public function rules()
	{
		return array(
			// name, email, subject and body are required
			array('qty', 'required'),
			// email has to be a valid email address
			array('qty', 'numerical'),
		);
	}

	/**
	 * Declares customized attribute labels.
	 * If not declared here, an attribute would have a label that is
	 * the same as its name with the first letter in upper case.
	 */
	public function attributeLabels()
	{
		return array(
			///'name'=>Yii::t('app','Product Name'),
			///'price'=>Yii::t('app','Price'),
			'qty'=>Yii::t('app','Qty'),
			///'total'=>Yii::t('app','Total'),
		);
	}
}
