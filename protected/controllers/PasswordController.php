<?php
require('RestController.php');

class PasswordController extends RestController
{
	protected $selfModel = 'PasswordForm';
	public  $title = "eShop Password Management";

	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
		);
	}	

	protected function modelUpdate(CModel $model, array $data)
	{
		///Yii::log('modelUpdate is called request='.Yii::app()->request->requestType,'warning');
		//like settings
		$model->attributes = $data;
		if($model->validate())
		{
			$user = Account::current();
			if($user ->validatePassword($model->currentPassword))
			{
						$user->password = md5($model->password);
						//$this->debug_array($user->attributes);
						$connection=Yii::app()->db; 
						$transaction=$connection->beginTransaction();
						try 
						{
							$user->save();
						}catch(Exception $e)
						{
							$transaction->rollback();
							$this->sendResponse(200, CJSON::encode(array(
								'valid'=>false, 
								'message'=>array('exception'=>$e->message))));	
						}
						$transaction->commit();
			
						$message =	Yii::t('app', 'Your password was changed successfully');
						$this->sendResponse(200, CJSON::encode(array(
							'valid'=>true, 
							'message'=>array('confirmation'=>$message))));	
			}else
			{
						$message =	Yii::t('app','Your current password is invalid');
						$this->sendResponse(200, CJSON::encode(array(
							'valid'=>false, 
							'message'=>array('$'=>$message))));	
			}
		}else
				$this->sendResponse(200, CJSON::encode(array(
					'valid'=>false, 
					'message'=>$model->errors)));
	}

	/*
	public function actionIndex()
	{
		$this->render('index');
	}
	*/
	// -----------------------------------------------------------
	// Uncomment the following methods and override them if needed
	/*
	public function filters()
	{
		// return the filter configuration for this controller, e.g.:
		return array(
			'inlineFilterName',
			array(
				'class'=>'path.to.FilterClass',
				'propertyName'=>'propertyValue',
			),
		);
	}

	public function actions()
	{
		// return external action classes, e.g.:
		return array(
			'action1'=>'path.to.ActionClass',
			'action2'=>array(
				'class'=>'path.to.AnotherActionClass',
				'propertyName'=>'propertyValue',
			),
		);
	}
	*/
	
}
