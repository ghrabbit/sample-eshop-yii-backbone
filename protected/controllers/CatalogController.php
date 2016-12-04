<?php
require('RestController.php');

class CatalogController extends RestController
{
	protected $selfModel = 'CatalogForm';

/*
	public function actionIndex()
	{
			$this->actionCategory();
	}
	
	public function actionCategory()
	{
		///$this->DOC_TITLE = Yii::t('app','Shopping Catalog');
		$id = isset($_GET['id'])?$_GET['id']:0;
		//Yii::log('id='.$id,'warning');
		$pageNo = isset($_GET['page'])?$_GET['page']:1;
		$model = Category::model()->findByPK($id);
		$categories = $model->getSubCategoriesPage($pageNo,6);
 		$criteria = new CDbCriteria();
		$count=$model->getSubCategoriesTotalCount();
		$pages=new CPagination($count);

		// results per page
		$pages->pageSize=6;
		$pages->applyLimit($criteria);
 		
 		$params = array(
			///'ME' => Yii::app()->homeUrl.$this->route,
			'id' => $id,
			'model'=> $model,
			'categories' => $categories,
			'pages' => $pages,
			'user'=> Account::model()->getUser(),
			'title' => Yii::t('app','Shopping Catalog'),
		);
		//$this->topSideMenu = $this->widget('SubCategories' ,array('qid_c'=>$qid_c));	
		$this->topSideMenu = array(
			'widget'=>'SubCategories' , 
			'args' => array('model'=>$model, 'categories'=>$categories)
		);	
		//'SubCategories';
		$this->render('/catalog/pages/categories',$params);
	}
	
	public function actionProducts()
	{
		
		///$this->DOC_TITLE = Yii::t('app','Shopping Catalog');
		//category id  
		$id = isset($_GET['id'])?$_GET['id']:0;
		
		$model = Category::model()->findByPK($id);
		//$categories = $model->subCategories;//Category::get_sub_categories($id);
		///$products = $model->products;//Product::get_products($id);
 		//$pageNo = isset($_GET['pn'])?$_GET['pn']:1;
 		$pageNo = isset($_GET['page'])?$_GET['page']:1;
 		$products = $model->getProductsPage($pageNo, 6);
 		Yii::log('product count on page='.count($products),'warning');
 		
 		$criteria = new CDbCriteria();
		$count=$model->getProductsTotalCount();
		$pages=new CPagination($count);

		// results per page
		$pages->pageSize=6;
		$pages->applyLimit($criteria);
 		
 		$params = array(
			'ME' => Yii::app()->homeUrl.$this->route,
			'id' => $id,
			'model'=> $model,
			///'categories' => $categories,
			'products' => $products,
			'pages' => $pages,
			///'user'=> Account::model()->getUser(),
			'title' => Yii::t('app','Shopping Catalog'),
		);
		//$this->topSideMenu = $this->widget('SubCategories' ,array('qid_c'=>$qid_c));	
		//
		//$this->topSideMenu = array(
		//	'widget'=>'SubCategories' , 
		//	'args' => array('model'=>$model, 'products'=>$products)
		//);	
		//
		//'Products';
		$this->render('/catalog/pages/products',$params);
	}
	
	
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
			'username' => '',
			'user' => Yii::app()->session['user'],
			'id' => $id,
			'cid' => $cid,
			'model' => $prod,
			'title' => Yii::t('app','Product Details'),
			'template' => 'product/details', 
			);	
			$this->render('/catalog/product_details',$params);
 		}
 		catch(Exception $e) 
 		{
			//avoid default message
		}
		$params = array(
			'title' => Yii::t('app','Product Details'),
			'template' => 'product/details', 
		);	
		$this->render('/catalog/product_details',$params);
		
	}
*/	
}
