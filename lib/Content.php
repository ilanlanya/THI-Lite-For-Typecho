<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

class Content {
    private static $Thumb_I = 0;
    public static function randomThumb ($thumbs) {
        $thumbs = mb_split("\n", $thumbs);
        $thumb = $thumbs[rand(0, count($thumbs) - 1)];
        $thumb = trim($thumb);
        if (strpos ($thumb, '!') !== false) {
            $thumb = self::explodeThumb($thumb);
        }
        return $thumb;
    }
    
    public static function noThumb() {
        $imageList = [
            THI_Const::STATIC_URL . '/Background/10.jpg!top',
            THI_Const::STATIC_URL . '/Background/14.png',
            THI_Const::STATIC_URL . '/Background/18.jpg',
            THI_Const::STATIC_URL . '/Background/19.jpg',
            THI_Const::STATIC_URL . '/Background/25.jpg',
            THI_Const::STATIC_URL . '/Background/27.png',
            THI_Const::STATIC_URL . '/Background/30.jpg',
            THI_Const::STATIC_URL . '/Background/36.jpg',
            THI_Const::STATIC_URL . '/Background/68.png',
            THI_Const::STATIC_URL . '/Background/70.jpg'
        ];
        $thumb = $imageList[self::$Thumb_I];
        if (strpos ($thumb, '!') !== false) {
            $thumb = self::explodeThumb($thumb);
        }
        if ($i < count($imageList)) {
            self::$Thumb_I++;
        } else {
            self::$Thumb_I = 0;
        }
        return $thumb;  
    }
    
    public static function explodeThumb ($thumb) {
        $thumbArr = explode('!', $thumb);
        $thumb = [
            'img' => $thumbArr[0],
            'position' => $thumbArr[1]
            
        ];
        
        return $thumb;
    }
    
    public static function viewCounter ($archive) {
        $cid = $archive->cid;
        $views = Typecho_Cookie::get('__typecho_views');
        $views = !empty($views) ? explode(',', $views) : array();
        if(!in_array($cid, $views)){
            $db = Typecho_Db::get();
            $field = $db->fetchRow($db->select()->from('table.fields')->where('cid = ? AND name = ?', $cid , 'viewsNum'));
            if(empty($field)){
                $db->query($db->insert('table.fields')
                ->rows(array('cid' => $cid, 'name' => 'viewsNum', 'type' => 'str', 'str_value' => 1, 'int_value' => 0, 'float_value' => 0)));
            }else{
                $db->query($db->update('table.fields')->expression('str_value', 'str_value + 1')->where('cid = ? AND name = ?', $cid , 'viewsNum'));
            }
            array_push($views, $cid);
            $views = implode(',', $views);
            Typecho_Cookie::set('__typecho_views', $views); //记录到cookie
        }
    }
}
