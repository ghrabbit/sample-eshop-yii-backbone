<?php

class ShoppingController extends RestController
{
	protected $selfModel = 'Cart';
	/*
	public function actionIndex()
	{
		$model = Yii::app()->session['cart'];	
 		//$pageNo = isset($_GET['pn'])?$_GET['pn']:1;
 		$pageNo = isset($_GET['page'])?$_GET['page']:1;
 		$products = $model->cartPage($pageNo, 6);
 		///Yii::log('product count on page='.count($products),'warning');
 		
 		$criteria = new CDbCriteria();
		$count=count(Yii::app()->session['cart']->items);
		$pages=new CPagination($count);

		// results per page
		$pages->pageSize=6;
		$pages->applyLimit($criteria);
		$pages->params=array('page'=>$pageNo);
 		
 		$params = array(
			'model'=> $model,
			'products' => $products,
			'pages' => $pages,
			'title' => Yii::t('app','Shopping Cart'),
		);
		//$this->topSideMenu = $this->widget('SubCategories' ,array('qid_c'=>$qid_c));	
		
		//$this->topSideMenu = array(
		//	'widget'=>'SubCategories' , 
		//	'args' => array('model'=>$model, 'products'=>$products)
		//);	
		
		//'Cart Products';
		$this->render('/shopping/cart',$params);
	}
	*/
	
	// -----------------------------------------------------------
	/*
	function print_category_tree($id=false) {
	// prints the category tree by calling get_category_tree //

		echo Category::get_category_tree($id);
	}
    */
	protected function modelInit()	{return Yii::app()->session['cart'];}
    
   	protected function modelGetData(CModel $model, array $data)
	{
      ///utils::debug_array(array_values($model->items));
      ///Yii::log('JSON:'.CJSON::encode(array_values($model->items)),'warning');
      ///$this->sendResponse(200, '{\"items\":'.CJSON::encode(array_values($model->items)).'}');
      $this->sendResponse(200, CJSON::encode(array_values($model->items)));
	}
	
	public function actionCart() 
	{
		if(Yii::app()->request->isAjaxRequest)	
		{
			$this->redirect(Yii::app()->baseUrl.'/shopping/model');
		}
        /*
        else
		{
			$this->redirect('index');
		}
        */ 
	}

	public function actionCartAdd()
	{
		$request = Yii::app()->request;
		$id = isset($_GET['id'])?$_GET['id']:$request->getParam('id', -1);
		$qty = isset($_GET['qty'])?$_GET['qty']:$request->getParam('qty', 1);
		//Yii::log('id:'.$id.' qty:'.$qty,'warning');
		$cart = Yii::app()->session['cart'];
		
		try
        {
          $add_item = $cart->add($id, $qty);
        }catch(Exception $e)
        {
          Yii::log('Unable cart add id '.$id.' Exception='.$e->message,'warning'); 
        }
        ///$cart->recalc_total();
		if($request->isAjaxRequest && isset($add_item))		
		{
		  //$this->sendResponse(200, CJSON::encode($cart));
          $this->sendResponse(200, CJSON::encode($add_item));
		}
		$ref = $request->urlReferrer;
		if(isset($ref)){
			///Yii::log('urlReferer:'.$ref,'warning');
			$this->redirect($ref);
		}else 
			///Yii::log('urlReferer:NULL','warning');
			$this->redirect(array('shopping/index'));	
	}
	
	public function actionCartRemove()
	{
		$request = Yii::app()->request;
		$id = isset($_GET['id'])?$_GET['id']:$request->getParam('id', 0);
		$cart = Yii::app()->session['cart'];
		$removed = $cart->remove($id);
		//$cart->recalc_total();
		if($request->isAjaxRequest)		
		{
			$this->sendResponse(200, CJSON::encode($removed));
		}
		$ref = $request->urlReferrer;
		if(isset($ref)){
			$this->redirect($ref);
		}else 
			$this->redirect(array('shopping/index'));	
	}
	/*
	public function actionCartBook() 
	{
		if(Yii::app()->request->isAjaxRequest)		
		{
			$data = $_GET;//$this->getInputAsJson();
			//$this->debug_array($data );
			$product = new Product;
			$products = $product->cartBook(); 
			$this->sendResponse(200, CJSON::encode($products));
		}
		$this->ajax_required();
	}
	*/
	public function actionCartPage() 
	{
		if(Yii::app()->request->isAjaxRequest)		
		{
			$data = $_GET;//$this->getInputAsJson();
			//$this->debug_array($data );
			$pageNo = $data['pageNo'];
			$pageSize = $data['pageSize'];

            $cart = Yii::app()->session['cart']; 
            $items = $cart->itemsPage($pageNo, $pageSize); 
			//Yii::log('JSON CART ITEMS:'.CJSON::encode($items),'warning');
            $this->sendResponse(200, CJSON::encode($items));
		}
		$this->ajax_required();
	}
	

 /*
	public function actionProductDetails()
	{

		///$this->DOC_TITLE = Yii::t('app','Product Details'); 
		$id = isset($_GET['id'])?$_GET['id']:0;
		$cid = isset($_GET['cid'])?$_GET['cid']:0;
		if (empty($id)) {
			$this->redirect();
		}
		try
		{
			$prod = Product::load($id);
			$params = array(
			'ME' => Yii::app()->homeUrl.'/shopping/cart_view',
			'username' => '',
			'user' => Yii::app()->session['user'],
			'id' => $id,
			'cid' => $cid,
			'model' => $prod,
			'title' => Yii::t('app','Product Details'),
			'template' => 'product/details', 
			);	
			$this->render('/shopping/product_details',$params);
 		}
 		catch(Exception $e) 
 		{
			//avoid default message
		}
		$params = array(
			'title' => Yii::t('app','Product Details'),
			'template' => 'product/details', 
		);	
		$this->render('/shopping/product_details',$params);
		
	}
	*/
	/*
	public function actionCheckout() 
	{
		if(Yii::app()->request->isAjaxRequest)		
		{
			
			$isValid = false;
			$message = '';
			///$model = new Checkout;
			$model = isset(Yii::app()->session["checkout"])?Yii::app()->session["checkout"]:false;
			$data = $this->getInputAsJson();
			//if(isset($data)) $this->debug_array($data);
			//$this->debug_array($_GET);
			switch(Yii::app()->request->requestType) 
			{
			//create
			case 'POST' : Yii::app()->session["checkout"] = new Checkout;
				$isValid = true;
				$message = 'Checkout was created';
			break;
			//read & js fetch
			case 'GET' : 
			{
				//$model = Product::model()->findByPK($data['id']);
				///Yii::log('ID='.(isset($_GET['id'])?$_GET['id']:'undefined'),'warning');
				///if(!isset(Yii::app()->session["checkout"]))
				///	Yii::app()->session["checkout"] = new Checkout;
				if(isset($_GET['action']))
				{ 
					switch($_GET['action'])
					{
						case 'labels': 
							///Yii::log('ID='.(isset($_GET['id'])?$_GET['id']:'undefined'),'warning');
							$this->sendResponse(200, CJSON::encode($model->attributeLabels())); break;
						default : $this->inlineAction($_GET['action'], $model, $data);
					}
				}
				
				
				else if($model)
				{
					//$this->debug_array($model->relationsProxys());
					//$this->sendResponse(200, CJSON::encode($model->attributes));
					if(isset($_GET['labels']) && $_GET['labels']){
						$this->sendResponse(200, CJSON::encode(array_merge(
							$model->attributes,array('labels'=>$model->attributeLabels())
						)));
					}
					else
						$this->sendResponse(200, CJSON::encode($model->attributes));
				}
				$message =	Yii::t('app','Checkout is not created yet.');
		
			}break;
			//update
			case 'PUT' :
			{
				$model->attributes = $data;
				if($isValid = $model->validate())
				{
					$isValid = true;
					$message =	Yii::t('app','Checkout was completed.');
				}else
					$message =	Yii::t('app','Checkout is invalid.');
			}break;
			case 'DELETE' :
			{
				///$this->modelDelete(model, $data);
				unset(Yii::app()->session["checkout"]);
				$isValid = true;
				$message =	Yii::t('app','Checkout was canceled.');
			}break;
			}//endswitch
			$this->sendResponse(200, CJSON::encode(array(
				'valid'=>$isValid, 
				'message'=>array('$'=>$message))));	
		}	
		else
			$this->ajax_required(); ///for this action
	}
	*/
	
	public function actionPurchaseNow()
	{
		///wizzard-prev
		$model = new PurchaseDialog;
		$cart = Yii::app()->session['cart'];	
		//$this->debug_array($_POST);
		$step = isset($_POST['step'])?$_POST['step']:1;
		$dostep = isset($_POST['dostep'])?$_POST['dostep']:"wizzard-begin";
 		//$pageNo = isset($_GET['pn'])?$_GET['pn']:1;
 		///$pageNo = isset($_GET['page'])?$_GET['page']:1;
 		$products = Product::model()->cartBook();
 		///Yii::log('product count on page='.count($products),'warning');
 		
 		if(Yii::app()->request->isPostRequest) {
			$model->attributes = $_POST;
			if($dostep === "wizzard-prev")
				$step--;
			else
			{
				$step++;
				if($dostep === "wizzard-finish")
				{
					if($model->validate())
					{
						//create order and try to do another steps
						//if ok show success page and save order
						//else show fail page
					}else 
					{
						//generate errorSummary
					}
				}	
			}	
		}
		$params = array(
			'step'=>$step,
			'model'=> $model,
			'cart' => $cart,
			'products' => $products,
			//'pages' => $pages,
			'title' => Yii::t('app','Purchase'),
			'errorSummary' => isset($errorSummary)?$errorSummary:null
		);
		//$this->topSideMenu = $this->widget('SubCategories' ,array('qid_c'=>$qid_c));	
		/*
		$this->topSideMenu = array(
			'widget'=>'SubCategories' , 
			'args' => array('model'=>$model, 'products'=>$products)
		);	
		*/
		//'Cart Products';
		$this->render('/shopping/purchaseNow',$params);
	}
	
    //AJAX onspecials actions
	//garbage?
	public function actionOnSpecials() 
	{
		//$cart = Yii::app()->session['cart'];	
		$product = new Product;
		$products = $product->get_on_specials(); 
		if(Yii::app()->request->isAjaxRequest)		
		{
			$this->sendResponse(200, CJSON::encode($products));
		}
		$this->ajax_required();
	}
	
	public function actionOnSpecialsTotalCount() 
	{
		//$cart = Yii::app()->session['cart'];	
		$product = new Product;
		if(Yii::app()->request->isAjaxRequest)		
		{
			$this->sendResponse(200, CJSON::encode(array('totalCount' =>$product->get_on_specials_total_count())));
		}
		$this->ajax_required();
	}
	
	public function actionOnSpecialsPage() 
	{
		if(Yii::app()->request->isAjaxRequest)		
		{
			$data = $_GET;//$this->getInputAsJson();
			//$this->debug_array($data );
			$pageNo = $data['pageNo'];
			$pageSize = $data['pageSize'];
			$product = new Product;
			$products = $product->get_on_specials_page($pageNo, $pageSize); 
			//Yii::log('ON-SPECIALS-PAGE pageNo='.$pageNo.' pageSize='.$pageSize,'warning');
			/*
			$ret = CJSON::encode($products);
			Yii::log('ON-SPECIALS='.$ret,'warning');
			$this->sendResponse(200, $ret);
			*/
			$this->sendResponse(200, CJSON::encode($products));
		}
		$this->ajax_required();
	}
	
	public function actionCategoryParents() 
	{
		if(Yii::app()->request->isAjaxRequest)		
		{
			$data = $_GET;//$this->getInputAsJson();
			//$this->debug_array($data );
			$id = isset($data['id'])?$data['id']:0;
			$model = Category::model()->findByPk($id);
			$parent = $model;
			$collection = [];
			while($parent = $parent->parent)
			{
				$collection[] = $parent;
			}
			$this->sendResponse(200, 
				CJSON::encode(Ref::toJSON( array_reverse($collection))));
		}
		$this->ajax_required();
	}
}
