<?php
	
/**
 *
 * @property integer $id
 * @property integer $cid
 * @property string $title
 */
class Ref 
{ 
		/*
		public 		$id; //integer
		protected $cid;//string
		public		$title;
		
		public function Ref(CActiveRecord $object)
		{
			$this->id = $object->id;
			$this->cid = get_class($object);
			$class_methods = get_class_methods($this->cid);
			if(method_exists($object,'__toString'))
				$this->title = (string) $object;
			else	
				$this->title = $this->cid.'-'.$this->id;
		}
		
		public function unref()
		{
			//if(class_exists($this->cid))
			$model = new $this->cid;
			return $model->findByPK($this->id); 
		}
		*/
		private $data = array("id" => 0, "cid" => '', "title" => '');
		
		//public function attributes
		
		public function Ref(CActiveRecord $object)
		{
			$this->data['id'] = $object->id;
			$this->data['cid'] = get_class($object);
			$class_methods = get_class_methods($this->data['cid']);
			if(method_exists($object,'__toString'))
				$this->data['title'] = (string) $object;
			else	
				$this->data['title'] = $this->data['cid'].'-'.$this->data['id'];
		}
		/**
		public function Ref($id, string $cid)
		{
			$this->data['id'] = $id;
			$this->data['cid'] = $cid;
		}
		*/
		
		public function unref()
		{
			//if(class_exists($this->cid))
			$model = new $this->data['cid'];
			return $model->findByPK($this->data['id']); 
		}
		
		
		function __get($nm) {
			if($nm == 'attributes')
				return $this->data; 
			if (isset($this->data[$nm])) {
				$r = $this->data[$nm];
				return $r;
			}/* else {
				print "??????!\n";
			}
			*/
			return null;
		}
		/*
		function __set($nm, $val) {
			if (isset($this->x[$nm])) {
				$this->x[$nm] = $val;
			}// else {			print "??? ?????!\n";			}
		}*/
		
	static public function relations(CActiveRecord $model)
	{
		$ret = array();
		$rels = $model->relations();

		foreach($rels as $key=>$dsc)
		{
			//Yii::log("REL name= <$key>",'warning');
			$cur = $model->getRelated($key);
			//Yii::log("REL name= <$key> called getRelated",'warning');
			if(!isset($cur)) {
				//Yii::log("REL name= <'$key'> rec is empty",'warning');
				$ret[$key] = null;
			}	
			else if(is_array($cur))
			{
				//Yii::log("REL name= <$key> rec is collection",'warning');
				$collection = array();
				foreach($cur as $n=>$val) {
					//Yii::log("VAL class = <".get_class($val).">",'warning');
					$collection[$n] = (new Ref($val))->attributes;
				}	
				$ret[$key] = $collection;
				
			}
			else if($cur instanceof CActiveRecord)
				$ret[$key] = (object)(new Ref($cur))->attributes;
			else{
				//just assign value
				$ret[$key] = $cur;
				
			}	
			//Yii::log("REL name= <$key> END LOG",'warning');
		}

		return $ret;
	}
	
	static public function asArray(CActiveRecord $model)
	{
		//$ret  =
		return array('relations'=>Ref::relations($model)) + $model->attributes;
	}
	
	static public function asObject(CActiveRecord $model)
	{
		//$ret  =
		return (object) array('relations'=>Ref::relations($model)) + $model->attributes;
	}
	
	static public function toJSON($var)
	{
		
		if( $var instanceof CActiveRecord)
		{
			//Yii::log(CJSON::encode(Ref::asArray($var)),'warning');
			return CJSON::encode(Ref::asArray($var));
			//return CJSON::encode(Ref::asObject($var));
		}		
		else if(is_array($var))
		{
			$wrap = '['; //json array
			foreach($var as $index=>$object)
				{
					//Yii::log(CJSON::encode(Ref::asArray($object)),'warning');
					$wrap .= CJSON::encode(Ref::asArray($object)).',';
					//$wrap += CJSON::encode(Ref::asObject($object)).',';
				}
			if(count($var))	{
				//Yii::log($wrap,'warning');
				$wrap{strlen($wrap)-1}=']';
			}	
			else return '[]';	
			//Yii::log($wrap,'warning');
			return $wrap;
		}
		return '{}';	
	}			
}
