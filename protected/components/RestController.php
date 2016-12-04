<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class RestController extends Controller
{

	protected $selfModel;
	
	public function doModel($action, $model, $data) 
	{
		///Yii::log('doModel called action='.$action,'warning');
		switch($action) 
		{
			//create
			case 'POST' : 
				$this->modelCreate($model, $data);
			break;
			//read  js fetch
			case 'GET' : 
			{
				if(isset($_GET['action']))
				{ 
					switch($_GET['action'])
					{
						case 'labels': 
							//Yii::log('LOADING LABELS ID='.(isset($_GET['id'])?$_GET['id']:'undefined'),'warning');
							$this->sendResponse(200, CJSON::encode($model->attributeLabels())); break;
						default : $this->inlineAction($_GET['action'], $model, $data);
					}
				}else{
				///Yii::log('ID='.(isset($_GET['id'])?$_GET['id']:'undefined'),'warning');
					$this->modelGetData($model, $data);
				}			
			}break;
			//update
			case 'PUT' :
			{
				///Yii::log('modelUpdate will be called','warning');
				$this->modelUpdate($model, $data);
			}break;
			case 'DELETE' :
			{
				$this->modelDelete($model, $data);
			}break;
			}//endswitch
	}
	
	public function actionModel() 
	{
		///Yii::log('actionModel called request='.Yii::app()->request->requestType,'warning');
		if(Yii::app()->request->isAjaxRequest)		
		{
			
			//$model = self::model();
			$model = $this->modelInit();
			if(!($data = $this->getInputAsJson())) $data = array();
			//Yii::log('Request='.Yii::app()->request->requestType,'warning');
			//if(isset($data)) $this->debug_array($data);
			//$this->debug_array($_GET);
			$action = Yii::app()->request->requestType;
			
			//utils::debug_array($data);
			
			if($action === "GET")
			{
				///$this->debug_array($_GET);
				///$data = CJSON::decode($_GET['model'],true);
			}
			else if($action === "POST")
			{
				if(isset($_POST['_method']))
					$action = $_POST['_method'];
			}	
			/*
            else if put or delete 
			{
				//utils::debug_array($_POST);
				$data = CJSON::decode($_POST['model'],true);
			}
            */
			$this->doModel($action, $model, $data);
		}	
		else $this->ajax_required();
	}
	
	protected function modelInit()	{return new $this->selfModel;}
	
	protected function inlineAction($action, CModel $model, array $data)	{}
	
	protected function modelGetData(CModel $model, array $data)
	{
		///Yii::log('CALL modelGetData','warning');
		if($model instanceof CActiveRecord) 
			$this->recordGetData($model, $data);
		else 
			$this->sendResponse(200, CJSON::encode($model));
		
	}
	
	protected function recordGetData(CActiveRecord $model, array $data)
	{
		$model = $model->findByPK($_GET['id']);
		if($model)
		{
			/**
						if(isset($_GET['labels']) && $_GET['labels']){
							$this->sendResponse(200, CJSON::encode(array_merge(
								Ref::asArray($model),array('labels'=>$model->attributeLabels())
							)));
						}
						else
			*/
			$this->sendResponse(200, Ref::toJSON($model));
		}
		$message =	Yii::t('app','Invalid id. No object found');
		$this->sendResponse(200, CJSON::encode(array(
						'valid'=>false, 
						'message'=>array('$'=>$message))));	
	}
	
	protected function modelSetData(CModel $model, array $data)
	{
		$model->setAttributes($data);
	}
	
	protected function modelDelete(CModel $model, array $data)
	{
		if($model instanceof CActiveRecord) $this->recordDelete($model, $data);
	}
	
	protected function recordDelete(CActiveRecord $model, array $data)
	{
		//$this->debug_array($user->attributes);
		$connection=Yii::app()->db; 
		$transaction=$connection->beginTransaction();
		try 
		{
			$model->delete();
			$transaction->commit();
		}catch(Exception $e)
		{
			$transaction->rollback();
			$this->sendResponse(200, CJSON::encode(array(
							'valid'=>false, 
							'message'=>array('exception'=>$e->message))));	
		}
	}

	protected function modelCreate(CModel $model, array $data)
	{
		if($model instanceof CActiveRecord) $this->recordSave($model, $data);
		else ///$this->modelUpdate($model, $data);
			$this->modelGetData($model, $data);
	}	
	
	protected function recordSave(CActiveRecord $model, array $data)
	{
		//$this->debug_array($user->attributes);
		$connection=Yii::app()->db; 
		$transaction=$connection->beginTransaction();
		try 
		{
			$this->modelSetData($model, $data);
			$model->save();
			$transaction->commit();
		}catch(Exception $e)
		{
			$transaction->rollback();
			$this->sendResponse(200, CJSON::encode(array(
							'valid'=>false, 
							'message'=>array('exception'=>$e->message))));	
		}
		
						
		$message =	Yii::t('app','modelUpdated');
		$this->sendResponse(200, CJSON::encode(array(
							'valid'=>true, 
							'message'=>array('confirmation'=>$message))));	
				
	}
	
	protected function modelUpdate(CModel $model, array $data)
	{
		if($model instanceof CActiveRecord) $this->recordUpdate($model, $data);
        ///else $this->update($model, $data);
        ///else implement your own method what you gotta do
        else {
          $message = Yii::t('app','modelUpdated');
		  $this->sendResponse(200, CJSON::encode(array(
					'valid'=>true, 
					'message'=>array('confirmation'=>$message))));	
        }
	}
	
	protected function recordUpdate(CActiveRecord $model, array $data)
	{
			//$data = $this->getInputAsJson();
			$model->attributes = $data;
			//$this->debug_array($data);
			if($model->validate())
			{
				$this->recordSave($model, $data);	
			}else
				$this->sendResponse(200, CJSON::encode(array(
					'valid'=>false, 
					'message'=>$model->errors)));	
	}
	
	/*
	public function actionLabels() 
	{
		$request = Yii::app()->request;
		if($request->isAjaxRequest) 
		{	//	return false;
			//Yii::log('request->requestType='.$request->requestType,'warning');
			switch($request->requestType) 
			{
			//create
			case 'POST' : break;
			//read  js fetch
			case 'GET' : 
			{
				$code = 404;
				$msg = 'Invalid class name';
				if(isset($_GET['view']))
				try {	
					$model = new $_GET['view'];
					$code = 200;
					$msg = CJSON::encode($model->attributeLabels());
				}catch(Exception $e)
				{
					$code = 404;
					$msg = $e.message;//'Invalid class name:'.$_GET['view'];
				}
				$this->sendResponse($code, $msg);		
			}break;
			//update
			case 'PUT' : break;
			}//endswitch
		}
	}
	*/
    
    /**
	 * Gets RestFul data and decodes its JSON request
	 * @return mixed
	 */
	protected function getInputAsJson()
	{
		return CJSON::decode(file_get_contents('php://input'));
	}
	
}
