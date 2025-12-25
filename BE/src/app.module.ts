import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { PostsModule } from './posts/posts.module';
import { ProductsModule } from './products/products.module';
import { CommentsService } from './comments/comments.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { FollowModule } from './follow/follow.module';
import { LikesModule } from './likes/likes.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    AdminModule,
    IngredientsModule,
    PostsModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    FollowModule,
    LikesModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommentsService],
})
export class AppModule { }
