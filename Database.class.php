<?php
    class Database{
        private $host ='localhost';
        private $user ='test';
        private $password ='test';
        private $database ='code';
    }
    
    public function getConnection(){
        $hostDB = "mysql:host=".$this->$host.";dbname=".this->password.";";
    }

?>