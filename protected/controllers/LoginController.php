<?php
require('RestController.php');

class LoginController extends RestController
{
	protected $selfModel = 'LoginForm';
	public  $title = "eShop Login Management";

	protected function modelCreate(CModel $model, array $data)
	{
		$this->modelUpdate($model, $data);
	}

	protected function modelUpdate(CModel $model, array $data)
	{
		///Yii::log('modelUpdate is called request='.Yii::app()->request->requestType,'warning');
		$model->attributes=$data;
		if(!$model->validate()) {
			//$message = $model->errors;

            $message = [];
            foreach($model->errors as $error)
            {
              foreach($error as $i => $value)
              {
                 $msg = Yii::t('app', $value);
                 $message[] = ( isset($msg) && !empty($msg))? [$i=>$msg] : [$i=>$value];
              }     
            }
            $this->sendResponse(200, CJSON::encode(array(
					'valid'=>false, 
					'message'=>$message)));	
		}
		// validate user input and redirect to the previous page if valid

		$errorCode = $model->login();
		if($errorCode === UserIdentity::ERROR_NONE)
			{
				///$this->sendResponse(200, CJSON::encode(array('authenticated' => true)));
				$this->sendResponse(200, CJSON::encode(array(
					'valid'=>true, 
					'message'=>array('authenticated' => true))));
			}
		switch ($errorCode)
		{
					case UserIdentity::ERROR_USERNAME_INVALID:
						$error = 'Incorrect username';
						break;
					case UserIdentity::ERROR_PASSWORD_INVALID:
						$error = 'Incorrect password';
						break;
					case UserIdentity::ERROR_USER_IS_DELETED:
						$error = 'This user is deleted';
						break;
					default: $error = "Unknown error with code ".$errorCode;	
		}
		$this->sendResponse(401, $error);
	}


	
}
