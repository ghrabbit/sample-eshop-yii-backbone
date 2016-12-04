<?php

class ProductController extends RestController
{
  protected $selfModel = 'Product';
  public $title = "Product"; 
  
  	public function actionIndex($info = null)
	{
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		
		$this->pageTitle = Yii::t('app','Product Management');
		$this->topSideMenu = array(
			'widget'=>'ModelActions' , 
			'templatePath'=>/*$this->getId(),*/'product',
			'args' => array(
				'actions'=>array(),
				'view'=>'actions/product',
			)
		);
		
		$this->render('index', array(
            'items' => Product::model()->findAll(),
            'info' => $info,
        ));	
	}
	
	//create new product
	
	function actionCreate() {
		
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		$model = new Product;
		
		if(Yii::app()->request->requestType === 'POST') {
			$model->attributes = $_POST;
			if($model->validate()) 
			{
				$model->saveCarefully($_POST['categories']);
				$this->redirect(array('index'));
			}	
		}
		$this->pageTitle = Yii::t('app','Product Management').'/'.Yii::t('app','Edit');
		$this->render('edit',array('model'=>$model));
	} 
	
	function actionEdit($id) {
		
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		
		if(Yii::app()->request->requestType === 'GET') {
	
			//* load up the information for the product *//
			$model = Product::model()->findByPk($id);

		}else if(Yii::app()->request->requestType === 'POST') {
			$model = Product::model()->findByPk($id);
			$model->attributes = $_POST;
			$model->saveCarefully($_POST['categories']);

			$this->redirect(array('index'));
		}

		$this->pageTitle = Yii::t('app','Product Management').'/'.Yii::t('app','Edit');
		$this->render('edit',array('model'=>$model));
	} 

	public function actionRemove($id = 0)
	{
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		
		if(/*(Yii::app()->request->requestType === 'GET') and*/ $id>0) {
			
            $model = Product::model()->findByPk($id);
			YII::log('*** Try delete product '.$model->title,'warning');
            $content = $this->renderView('deleted', 'product', array('model'=>$model));
            $transaction=$model->dbConnection->beginTransaction();
            try
            {
              if($wasDeleted = $model->delete()) {
                $transaction->commit();
              }else{
                $content = $this->renderView('error', 'documents', array('errors'=>[
                  value=>'*** UNABLE delete product '.$model->title,
                ]));
              }  
            }
            catch(Exception $e)
            {
              $transaction->rollBack();
              throw new CDbException('Unable delete Product record:'.$e->getMessage());
            }
			$this->redirect(array('index','info'=>$content));
		}
	}
 
    
}
