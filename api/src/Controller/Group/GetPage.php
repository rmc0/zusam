<?php

namespace App\Controller\Group;

use App\Controller\ApiController;
use App\Entity\Group;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class GetPage extends ApiController
{
    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $serializer
    ) {
        parent::__construct($em, $serializer);
    }

    /**
     * @Route("/groups/{id}/page/{n}", methods={"GET", "HEAD"})
     */
    public function index(string $id, int $n): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $group = $this->em->getRepository(Group::class)->findOneById($id);
        if (empty($group)) {
            return new JsonResponse(['error' => 'Group not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $this->denyAccessUnlessGranted(new Expression('user in object.getUsersAsArray()'), $group);

        $query = $this->em->createQuery(
            "SELECT m FROM App\Entity\Message m"
            ." WHERE m.group = '".$group->getId()."'"
            .' AND m.isInFront = 1'
            .' ORDER BY m.lastActivityDate DESC'
        );
        $query->setMaxResults(30);
        $query->setFirstResult(30 * $n);
        $messages = $query->getResult();

        $query = $this->em->createQuery(
            "SELECT COUNT(m.id) AS totalItems FROM App\Entity\Message m"
            ." WHERE m.group = '".$group->getId()."'"
            .' AND m.isInFront = 1'
        );
        $totalItems = $query->getResult();

        $page = [];
        foreach ($messages as $message) {
            $previewId = $message->getPreview() ? $message->getPreview()->getId() : '';
            $authorId = $message->getAuthor() ? $message->getAuthor()->getId() : '';
            $page[] = [
                'id' => $message->getId(),
                'entityType' => $message->getEntityType(),
                'data' => $message->getData(),
                'author' => $authorId,
                'preview' => $previewId,
                'children' => count($message->getChildren()),
                'lastActivityDate' => $message->getLastActivityDate(),
            ];
        }

        $data = [
            'messages' => $page,
            'totalItems' => $totalItems[0]['totalItems'],
        ];
        $response = new JsonResponse($data, JsonResponse::HTTP_OK);
        $response->setCache([
            'etag' => md5(json_encode($data)),
            'max_age' => 0,
            's_maxage' => 3600,
            'public' => true,
        ]);

        return $response;
    }
}
