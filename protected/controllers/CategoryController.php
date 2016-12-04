<?php
require('RestController.php');

class CategoryController extends RestController
{
	protected $selfModel = 'Category';
	public $title = "Category";

	public function actionSubCategoriesTotalCount() 
	{
		
		if(Yii::app()->request->isAjaxRequest)		
		{
			//$categoryName = $data['category']; 
			//$model = Category::model()->find('name = :name',array(':name'=>$categoryName));
			if(isset($_GET['id']) && ($model = Category::model()->findByPK($_GET['id'])))
			{
				$this->sendResponse(200, CJSON::encode(array('totalCount' =>$model->getSubCategoriesTotalCount())));
			}	
			$message =	Yii::t('app',(isset($_GET['id'])?'Invalid id':'Id not present').'. Not object found');
			$this->sendResponse(200, CJSON::encode(array(
				'valid'=>false, 
				'message'=>array('$'=>$message)
			)));	
		}
		$this->ajax_required();
	}
	
	public function actionSubCategoriesPage() 
	{
			
		if(Yii::app()->request->isAjaxRequest)		
		{
			$data = $_GET;//$this->getInputAsJson();
			//$this->debug_array($data );
			$pageNo = $data['pageNo'];
			$pageSize = $data['pageSize'];
			$model = Category::model()->findByPK($_GET['id']);
			if($model)
			{
				$collection = $model->getSubCategoriesPage($pageNo, $pageSize); 
				
				//$this->sendResponse(200, CJSON::encode($collection));
				$this->sendResponse(200, Ref::toJSON($collection));
			}	
			$message =	Yii::t('app','Invalid category id. No object found');
			$this->sendResponse(200, CJSON::encode(array(
							'valid'=>false, 
							'message'=>array('$'=>$message))));	
		}
		$this->ajax_required();
	}
	
	public function actionProductsPage() 
	{
			
		if(Yii::app()->request->isAjaxRequest)		
		{
			$data = $_GET;//$this->getInputAsJson();
			//utils::debug_array($data );
			$pageNo = $data['pageNo'];
			$pageSize = $data['pageSize'];
			/*
			$model = Category::model()->with(array(
				'products'=>array(
					//	'pagination'=>array(  'currentPage' => $data['pageNo'] - 1, 	'pageSize'=>$data['pageSize'], ),
					'offset' => ($data['pageNo'] - 1)*$data['pageSize'],
					'limit'=>$data['pageSize'],
				),
			))->findByPK($data['id']);
			*/
			$model = Category::model()->findByPK($data['id']);
			if($model)
			{
				$collection = $model->getProductsPage($pageNo, $pageSize); 
				//$collection = $model->products();
				//$this->sendResponse(200, CJSON::encode($collection));
				$this->sendResponse(200, Ref::toJSON($collection));
			}	
			$message =	Yii::t('app','Invalid category id. No object found');
			$this->sendResponse(200, CJSON::encode(array(
							'valid'=>false, 
							'message'=>array('$'=>$message))));	
		}
		$this->ajax_required();
	}
    
    
    /* 
     *  ADMIN ACTIONS
     *  */
     
     	public function actionIndex($info=null)
	{
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		
		$this->topSideMenu = array(
			'widget'=>'ModelActions' , 
			'templatePath'=>'category',
			'args' => array(
				'actions'=>array(),
				'view'=>'actions/category',
			)
		);	
		$this->pageTitle = Yii::t('app',"List of Categories");
        $model = new Category;
		$this->render('index', array('info'=>$info, 'items' => $model->findAll()));
	}

/*
 * print a category form so we can edit new category
 * name: actionCreate
 * @param
 * @return
 * 
 */
	
	function actionCreate() {
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		
		$model = new Category;
		
		if(Yii::app()->request->requestType === 'POST') 
		{
			if(isset($_POST['parent_ids']))
			{
				$ids = $_POST['parent_ids']; //expected array !
				$model->parent_id = count($ids)?$ids[0]:0;
			}
			$model->attributes = $_POST;
			if($model->validate()) 
			{
				$model->save();
				$this->redirect(array('index'));
			}
		}
		//set parent by default
		if(!isset($model->parent_id))
			$model->parent = Category::model()->findByPk(0);
		$this->pageTitle = Yii::t('app',"Edit Category");
		$this->render('edit',array(
			'model'=>$model,
		));
	} 
	
	
	public function actionRemove($id)
	{
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		if(Yii::app()->request->requestType === 'GET'){
			$model = Category::model()->findByPk($id);
			//$content = $this->renderPartial('deleted', array('model'=>$model),true);
			$content = $this->mustacheRenderPartial('deleted', $this->getId(), array('model'=>$model));
			$model->delete();	
			$this->redirect(array('index','info'=>$content));
		}
	}
	
/*
 * print a category form so we can add and edit the selected category 
 * name: actionEdit
 * @param $id integer
 * @return
 * 
 */
	 
	function actionEdit($id) {
	
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
				
		if(Yii::app()->request->requestType === 'GET') {
			// load up the information for the category 
			$model = Category::model()->findByPk($id);
		}else if(Yii::app()->request->requestType === 'POST')
		{
			$model = Category::model()->findByPk($_POST['id']);
			if(isset($_POST['parent_ids']))
			{
				//extract one from array if exists
				//else parent set to top
				$ids = $_POST['parent_ids']; //expected array !
				$model->parent_id = count($ids)?$ids[0]:0;
			}
			$model->attributes = $_POST;
			if($model->validate()) 
			{
				$model->save();
				$this->redirect(array('index'));
			}
		}
		$this->pageTitle = Yii::t('app',"Edit Category");
		$this->render('edit',array('model'=>$model));
	} 
}
