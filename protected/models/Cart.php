<?php

class Cart extends CFormModel
{
	public $items = array();		/* array of cart items */
	//public $total = 0;		/* total of the cart */
	/**
	 * Declares customized attribute labels.
	 * If not declared here, an attribute would have a label that is
	 * the same as its name with the first letter in upper case.
	 */
	public function attributeLabels()
	{
		return array(
			'shopping'=>Yii::t('app','Shopping'),
			'shopping-cart'=>Yii::t('app','Shopping Cart'),
			'qty'=>Yii::t('app','Qty'),
			'total'=>Yii::t('app','Total'),
			'grand-total'=>Yii::t('app','Grand Total'),
			'price' => Yii::t('app','Price'),
			'purchase-now'=>Yii::t('app','Purchase Now'),
			
			'product' => Yii::t('app','Product'),
			'productDetails' => Yii::t('app','Product Details'),
			'addToCart' => Yii::t('app','Add to Cart'),
			'addUnitToCart' => Yii::t('app','Add unit to Cart'),
			'removeUnitFromCart' => Yii::t('app','Remove unit from Cart'),
			'removeFromCart' => Yii::t('app','Remove from Cart'),
			'image' => Yii::t('app','Image'),
			'title' => Yii::t('app','Shopping Cart'),
		);
	}
	
public function create($id, $qty)	
{
  //Yii::log("TRY CREATE ITEM: id=$id, qty=$qty",'warning');
  $this->items[$id] = CartItem::factory($id, $qty);  
  //Yii::log("CREATE ITEM SUCCESS: id=$id, qty=$qty",'warning');
  return $this->items[$id];
}

public function update($id, $qty)	
{
  if (($this->items[$id]->qty += $qty) < 1) {
    unset($this->items[$id]);
    return null;
  }
  return $this->items[$id];
}
/* add an item to the shopping cart and update the total price 
 * 
 * name: add
 * @param $id
 * @param $qty
 * @return void
 * 
 */
function add($id, $qty) {
  if (isset($id)) 
  {
	return isset($this->items[$id])?$this->update($id, $qty):$this->create($id, $qty);
  }
  return null;
}

/* set the quantity of a product in the cart to a specified value
 * 
 * name: set
 * @param $id
 * @param $qty
 * @return void
 * 
 */
function set($id, $qty) {
		if (isset($id)) {
			$this->items[$id]->qty = (int) $qty;
		}
	}

/* remove a given product from the cart
 * 
 * name: remove
 * @param $id
 * @return void
 * 
 */
function remove($id) {
  if (isset($id)) {
    $removed = $this->items[$id];  
	unset($this->items[$id]);
    return $removed;
  }
  return null;
}	
/* remove all products from the cart
 * 
 * name: clear
 * @return void
 * 
 */    
function clear() {
		array_splice($this->items,0);
		//$this->total = 0;
	}
	
	function itemcount() {
	/* returns the number of individual items in the shopping cart (note, this
	 * takes into account the quantities of the items as well) */

		$count = 0;
		foreach ($this->items as $id => $item) {
			$count += $item->qty;
		}

		return $count;
	}

	/* return a comma delimited list of all the products in the cart, this will
	 * be used for queries, eg. SELECT id, price FROM products WHERE id IN ....
     */
	function get_productid_list() {

		$productid_list = "";

		foreach ($this->items as $id => $item) {
			$productid_list .= ",'" . $id . "'";
		}

		// need to strip off the leading comma 
		return substr($productid_list, 1);
	}

/*
 * recalculate the total for the shopping cart
 * name: recalc_total
 * @param
 * @return
 * 
 */
	function recalc_total() {

      $total = 0;
      foreach ($this->items as $id => $item) {
			$total += $item->qty * $item->product->price;
	  }
	  return total;	
	}
	
    /*
	static function ftotal()
	{
		$ttl = sprintf("%.2f", isset(Yii::app()->session['cart']) ? Yii::app()->session['cart']->total : 0.0);
		return '<i class="fa fa-rub"></i> '. $ttl;
	}
    */
	
	public function itemsPage($pageNo = 1, $pageSize = 0)
	{
      $offset = ($pageNo - 1)* $pageSize;
      return array_slice($this->items,$offset,$pageSize);
	}
	
	public function products() {
	  /*
      	$in_clause = $this->get_productid_list();
		if (empty($in_clause)) {
			return [];
		}
		
		$result=new CActiveDataProvider(new Product, array(
			'criteria'=>array(
				'condition'=>"id in ($in_clause)",
			),
		));

		return $result->getData();
      */

      return array_map(function ($item) {
          return $item->product;
        }, $this->items);
	}
	
    /*
	public function products2Items($products = null)
	{
		$items = array();
		if(is_null($products))
			$products = $this->products();
		if(is_array($products))
		foreach ($products as $prod) { 
			$model=new CartItem;
			$model->product = $prod;
			$model->qty = $this->items[$prod->id];
			$items[] = $model;
		}
		return $items;
	}
    */
}
