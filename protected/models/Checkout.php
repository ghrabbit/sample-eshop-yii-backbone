<?php

/**
 * CatalogForm class.
 * CatalogForm is the data structure for keeping
 */
class Checkout extends CFormModel
{
	public $customer;
	public $contact;
	public $address;
	public $comments;
	/**
	 * Declares customized attribute labels.
	 * If not declared here, an attribute would have a label that is
	 * the same as its name with the first letter in upper case.
	 */
	public function attributeLabels()
	{
		return array(
			'purchase' => Yii::t('app','Purchase'),
			'title' => Yii::t('app','Checkout'),
			'step1'=>Yii::t('app','Enter Billing Information'),
			'step2'=>Yii::t('app','Comments / Special Instructions'),
			'step3'=>Yii::t('app','Billing Details'),
			'step4'=>Yii::t('app','Order Details'),
			
			'customer'=>Yii::t('app','Customer'),
			'contact'=>Yii::t('app','Contact'),
			'address'=>Yii::t('app','Address'),
			'comments'=>Yii::t('app','Comments'),
			'next'=>Yii::t('app','Next'),
			'prev'=>Yii::t('app','Previous'),
			'finish'=>Yii::t('app','Finish'),
			'billTo'=>Yii::t('app','Bill To'),
			'billingDetails'=>Yii::t('app','Billing Details'),
			
			'product' => Yii::t('app','Product'),
			'price' => Yii::t('app','Price'),
			'qty'=>Yii::t('app','Qty'),
			'total'=>Yii::t('app','Total'),
			'subTotal'=>Yii::t('app','Sub Total'),
			'grandTotal'=>Yii::t('app','Grand Total'),
			'valute'=>Yii::t('app','Rub'),
			'date'=>Yii::t('app','Date'),
		);
	}
	
	public function defaultValues() 
	{
		$user = Yii::app()->session["user"];
		if(!isset($user)) return;
		$this->customer = $user->firstname.' '.$user->lastname;
		$this->contact = $user->phone.'/'.$user->email;
		$this->address = $user->address;
	}
}
