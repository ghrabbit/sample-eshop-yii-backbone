<?php

require('AdminController.php');

class OrderController extends AdminController
{

	public function actionIndex($info = null)
	{
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		$this->pageTitle = Yii::t('app','Order Log');
		$this->topSideMenu = array(
			'widget'=>'ModelActions' , 
			'templatePath'=>$this->getId(),
			'args' => array()
		);

		$this->render('index', array('model'=>new Order,'items' =>  Order::model()->findAll(), 'info' => $info));	

	}

	// -----------------------------------------------------------

	
	public function actionView($id)
	{
		/*
		*  GET ONLY ACTION
		*/
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		$this->pageTitle = Yii::t('app','Order Log');
		if(Yii::app()->request->requestType === 'GET') {
			$this->render('view', array('model' => Order::model()->findByPK($id)));
		}
	}

    public function actionDeleteAll()
	{
		/*
		*  GET ONLY ACTION
		*/
		User::require_login();
		$user = User::current();
		$user->require_role("admin");
		
        $model = Order::model();
        $transaction=$model->dbConnection->beginTransaction();
        try
        {
          $model->deleteAllCascade();
          $transaction->commit();
        }
        catch(Exception $e)
        {
          $transaction->rollBack();
          throw new CDbException('Unable delete Order records:'.$e->getMessage());
        }
        $this->redirect('index');
	}

}
