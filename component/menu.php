<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<div class="nav">
    <ul id="menu-menu" class="menu-menu">
        <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
        <?php while($pages->next()): ?>
        <li id="menu-item-<?php $pages->slug(); ?>" class="pview menu-item"><a href="<?php $pages->permalink(); ?>"><?php $pages->title(); ?></a></li>
        <?php endwhile; ?>
    </ul>
</div>